import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { Card } from "@/presentation/components/ui/card";
import { Loader2 } from "lucide-react"; 

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

// Imports de Lógica e Estilo
import { fetchHospitalsFromOSM } from './MapaApi';
import { enrichHospitalData, type EnrichedHospital } from '@/shared/lib/hospitalService'; 
import { createHospitalStyle, createUserStyle } from '@/shared/lib/MapStyles'; // (Se tiver separado o arquivo)

const USER_FIXED_LOCATION = [-34.837581, -7.100608]; 
const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

interface MapaProps {
  onHospitalsFound?: (hospitals: EnrichedHospital[]) => void;
}

function MapaHospitaisMapComponent({ onHospitalsFound }: MapaProps) {
  // --- Refs e States ---
  const mapElement = useRef<HTMLDivElement>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hospitalSourceRef = useRef<VectorSource>(new VectorSource());
  
  const [hospitals, setHospitals] = useState<EnrichedHospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- 1. INICIALIZAÇÃO DO MAPA (Executa 1 vez) ---
  useEffect(() => {
    if (mapRef.current || !mapElement.current) return;

    const centerWebMercator = fromLonLat(USER_FIXED_LOCATION);
    const userSource = new VectorSource();

    // Configura Overlay (Tooltip)
    const overlay = new Overlay({
      element: tooltipElement.current!,
      offset: [0, -10],
      positioning: 'bottom-center',
      stopEvent: false,
    });

    // Instancia o Mapa
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new XYZ({ url: MAP_STYLE_LIGHT, attributions: '© CartoDB' }) }),
        new VectorLayer({ source: hospitalSourceRef.current }), // Usa a ref da source
        new VectorLayer({ source: userSource, zIndex: 9999 }), 
      ],
      overlays: [overlay],
      view: new View({ center: centerWebMercator, zoom: 15, minZoom: 4 }),
    });

    mapRef.current = map;

    // Configura Pino do Usuário
    const userFeature = new Feature({ geometry: new Point(centerWebMercator), name: "Sua Localização" });
    userFeature.setStyle(createUserStyle()); // Usa o helper visual
    userSource.addFeature(userFeature);

    // Configura Eventos de Mouse (Tooltip)
    map.on('pointermove', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature && feature.get('name') !== 'Sua Localização') {
        if (tooltipElement.current) {
          tooltipElement.current.innerHTML = feature.get('name');
          tooltipElement.current.style.display = 'block';
        }
        overlay.setPosition(evt.coordinate);
        mapElement.current!.style.cursor = 'pointer';
      } else {
        if (tooltipElement.current) tooltipElement.current.style.display = 'none';
        mapElement.current!.style.cursor = '';
      }
    });

    // Cleanup ao desmontar
    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  // --- 2. LÓGICA DE NEGÓCIO (Busca e Renderização) ---
  const fetchAndRenderHospitals = useCallback(async () => {
    if (!mapRef.current) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    mapRef.current.updateSize();
    const size = mapRef.current.getSize();
    if (!size || size[0] === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const extent = mapRef.current.getView().calculateExtent(size);
      const rawData = await fetchHospitalsFromOSM(extent, controller.signal);
      if (!rawData) return;

      const enrichedData = rawData.map(h => 
        enrichHospitalData(h, USER_FIXED_LOCATION[1], USER_FIXED_LOCATION[0])
      );

      setHospitals(enrichedData);
      if (onHospitalsFound) onHospitalsFound(enrichedData);

      // Atualiza os pinos no mapa
      hospitalSourceRef.current.clear();
      const features = enrichedData.map((hospital) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([hospital.coordinates.x, hospital.coordinates.y])),
          name: hospital.name,
        });
        feature.setStyle(createHospitalStyle(hospital.status)); // Usa o helper visual
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

  // --- 3. GESTÃO DE EVENTOS (Resize e Drag) ---
  useEffect(() => {
    if (!mapRef.current || !mapElement.current) return;

    const handleMapUpdate = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setIsLoading(true);
      debounceTimer.current = setTimeout(fetchAndRenderHospitals, 300);
    };

    // Observer para redimensionamento (Layout Shift)
    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.updateSize();
      handleMapUpdate();
    });
    
    resizeObserver.observe(mapElement.current);
    
    // Listener de movimento do mapa
    mapRef.current.on('moveend', handleMapUpdate);

    // Carga inicial
    handleMapUpdate();

    return () => {
      resizeObserver.disconnect();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchAndRenderHospitals]);

  return (
    <div>
      <Card className="p-0 border-gray-200 overflow-hidden relative">
        <div ref={mapElement} className="w-full h-[500px] bg-gray-100" />
        <div ref={tooltipElement} className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none hidden z-50 whitespace-nowrap shadow-lg" />

        {isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs font-semibold text-gray-700">Buscando locais...</span>
          </div>
        )}

        <div className="p-3 bg-gray-50 border-t border-gray-200">
           <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-gray-500 font-semibold border px-2 py-0.5 rounded bg-gray-50">
                  {hospitals.length} Locais Visíveis
              </span>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-700">Vazio</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-gray-700">Moderado</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-700">Cheio</span></div>
           </div>
        </div>
      </Card>
    </div>
  );
}

export default memo(MapaHospitaisMapComponent);