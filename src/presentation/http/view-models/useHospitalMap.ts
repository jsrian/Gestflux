import { useEffect, useRef, useState, useCallback } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

import type { EnrichedHospital } from "@/domain/entities/Hospital";
// IMPORTANTE: Importar o tipo BoundingBox do repositório
import type { BoundingBox } from "@/domain/repositories/IHospitalRepository";

import { createHospitalStyle, createUserStyle } from '@/presentation/styles/MapStyles';

// Importa o UseCase e o Repositório
import { FindNearbyHospitals } from '@/application/use-cases/hospitals/HospitaisPerto'; 
import { fetchHospitalsFromOSM } from '@/infrastructure/http/api/MapaApi'; 

// --- CORREÇÃO 1: O Adapter ---
// O Adapter traduz o "idioma" do Domínio (Objeto BBox) para o "idioma" da Infra (Array de números)
const osmRepositoryAdapter = {
  findHospitalsInArea: async (bbox: BoundingBox, signal?: AbortSignal) => {
    // Converte { minLon, minLat... } -> [minLon, minLat, maxLon, maxLat]
    const extentArray = [bbox.minLon, bbox.minLat, bbox.maxLon, bbox.maxLat];
    return fetchHospitalsFromOSM(extentArray, signal);
  }
};

const USER_FIXED_LOCATION = [-34.837581, -7.100608];
const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

interface UseHospitalMapProps {
  onHospitalsFound?: (hospitals: EnrichedHospital[]) => void;
}

export function useHospitalMap({ onHospitalsFound }: UseHospitalMapProps) {
  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const hospitalSourceRef = useRef<VectorSource>(new VectorSource());
  
  // Controle de Abort e Debounce
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // States
  const [hospitals, setHospitals] = useState<EnrichedHospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. Inicialização do Mapa (Mantém igual) ---
  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    const centerWebMercator = fromLonLat(USER_FIXED_LOCATION);
    const userSource = new VectorSource();

    const overlay = new Overlay({
      element: tooltipRef.current!,
      offset: [0, -10],
      positioning: 'bottom-center',
      stopEvent: false,
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        new TileLayer({ source: new XYZ({ url: MAP_STYLE_LIGHT, attributions: '© CartoDB' }) }),
        new VectorLayer({ source: hospitalSourceRef.current }),
        new VectorLayer({ source: userSource, zIndex: 9999 }),
      ],
      overlays: [overlay],
      view: new View({ center: centerWebMercator, zoom: 15, minZoom: 4 }),
    });

    mapInstanceRef.current = map;

    const userFeature = new Feature({ geometry: new Point(centerWebMercator), name: "Sua Localização" });
    userFeature.setStyle(createUserStyle());
    userSource.addFeature(userFeature);

    map.on('pointermove', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature && feature.get('name') !== 'Sua Localização') {
        if (tooltipRef.current) {
          tooltipRef.current.innerHTML = feature.get('name');
          tooltipRef.current.style.display = 'block';
        }
        overlay.setPosition(evt.coordinate);
        mapContainerRef.current!.style.cursor = 'pointer';
      } else {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
        mapContainerRef.current!.style.cursor = '';
      }
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // --- 2. Busca de Dados (USANDO O USE CASE) ---
  const fetchAndRenderHospitals = useCallback(async () => {
    if (!mapInstanceRef.current) return;
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    mapInstanceRef.current.updateSize();
    const size = mapInstanceRef.current.getSize();
    
    if (!size || size[0] === 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Pega o Extent do OpenLayers (Array)
      const extent = mapInstanceRef.current.getView().calculateExtent(size);
      
      // --- CORREÇÃO 2: Converter Array para Objeto BoundingBox ---
      // O seu Domínio (FindNearbyHospitals) espera um objeto tipado, não um array solto.
      const bbox: BoundingBox = {
        minLon: extent[0],
        minLat: extent[1],
        maxLon: extent[2],
        maxLat: extent[3]
      };

      // Instancia o UseCase com o Repositório Adaptado
      const findHospitalsUseCase = new FindNearbyHospitals(osmRepositoryAdapter);
      
      // Executa passando o Objeto bbox
      const enrichedData = await findHospitalsUseCase.execute(
        bbox, 
        { lat: USER_FIXED_LOCATION[1], lon: USER_FIXED_LOCATION[0] }, 
        controller.signal
      );

      setHospitals(enrichedData);
      if (onHospitalsFound) onHospitalsFound(enrichedData);

      // Atualiza Pinos
      hospitalSourceRef.current.clear();
      const features = enrichedData.map((hospital) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([hospital.coordinates.x, hospital.coordinates.y])),
          name: hospital.name,
        });
        feature.setStyle(createHospitalStyle(hospital.status));
        return feature;
      });

      if (features.length > 0) hospitalSourceRef.current.addFeatures(features);

    } catch (error) {
      console.error("Erro ao buscar hospitais", error);
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, [onHospitalsFound]);

  // --- Listeners ---
  useEffect(() => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return;

    const handleMapUpdate = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setIsLoading(true);
      debounceTimer.current = setTimeout(fetchAndRenderHospitals, 300);
    };

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.updateSize();
      handleMapUpdate();
    });
    
    resizeObserver.observe(mapContainerRef.current);
    mapInstanceRef.current.on('moveend', handleMapUpdate);
    handleMapUpdate();

    return () => {
      resizeObserver.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchAndRenderHospitals]);

  return {
    mapContainerRef,
    tooltipRef,
    hospitals,
    isLoading
  };
}