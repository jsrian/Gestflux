import { useEffect, useRef, useState, memo } from 'react';
import { Card } from "@/presentation/components/ui/card";
import { fetchHospitalsFromOSM, type Hospital } from './MapaApi';
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
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';

// --- COORDENADAS FIXAS (MANAÍRA) ---
const USER_FIXED_LOCATION = [-34.837581, -7.100608]; 
const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

export interface EnrichedHospital extends Hospital {
  status: 'low' | 'medium' | 'high';
  queueSize: number;
  waitingTime: string;
  distance: string;
  address: string;
  specialties: string[];
}

interface MapaProps {
  onHospitalsFound?: (hospitals: EnrichedHospital[]) => void;
}

function MapaHospitaisMapComponent({ onHospitalsFound }: MapaProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const tooltipElement = useRef<HTMLDivElement>(null);
  const [hospitals, setHospitals] = useState<EnrichedHospital[]>([]);
  
  // Estado de Loading
  const [isLoading, setIsLoading] = useState(false);
  
  const mapRef = useRef<Map | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  // --- Lógica de Dados ---
  const enrichHospitalData = (hospital: Hospital): EnrichedHospital => {
    const statuses: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      ...hospital,
      status,
      queueSize: Math.floor(Math.random() * 20),
      waitingTime: "30 min",
      distance: "1.2 km",
      address: "Endereço via OSM",
      specialties: ["Geral", "Trauma"]
    };
  };

  const getPinColor = (status: string) => {
    switch (status) {
      case 'low': return '#22c55e';    
      case 'medium': return '#eab308'; 
      case 'high': return '#ef4444';   
      default: return '#94a3b8';
    }
  };

  useEffect(() => {
    if (mapRef.current) return; 
    if (!mapElement.current) return;

    const centerWebMercator = fromLonLat(USER_FIXED_LOCATION);
    const hospitalSource = new VectorSource(); 
    const userSource = new VectorSource();

    const overlay = new Overlay({
      element: tooltipElement.current!,
      offset: [0, -10],
      positioning: 'bottom-center',
      stopEvent: false,
    });

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new XYZ({ url: MAP_STYLE_LIGHT, attributions: '© CartoDB' }),
        }),
        new VectorLayer({ source: hospitalSource }), 
        new VectorLayer({ source: userSource, zIndex: 9999 }), 
      ],
      overlays: [overlay],
      view: new View({
        center: centerWebMercator,
        zoom: 15,
        minZoom: 4,
      }),
    });

    mapRef.current = map;

    // --- Interação: Tooltip ---
    map.on('pointermove', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      if (feature && feature.get('name') !== 'Sua Localização') {
        const coordinate = evt.coordinate;
        if (tooltipElement.current) {
          tooltipElement.current.innerHTML = feature.get('name');
          tooltipElement.current.style.display = 'block';
        }
        overlay.setPosition(coordinate);
        mapElement.current!.style.cursor = 'pointer';
      } else {
        if (tooltipElement.current) tooltipElement.current.style.display = 'none';
        mapElement.current!.style.cursor = '';
      }
    });

    // --- Pino "Você" ---
    const userFeature = new Feature({ geometry: new Point(centerWebMercator), name: "Sua Localização" });
    userFeature.setStyle(new Style({
        image: new Circle({ radius: 10, fill: new Fill({ color: '#2563eb' }), stroke: new Stroke({ color: 'white', width: 4 }) }),
        text: new Text({ text: 'VOCÊ', offsetY: -20, font: 'bold 14px sans-serif', fill: new Fill({ color: '#1e3a8a' }), stroke: new Stroke({ color: 'white', width: 3 }) })
    }));
    userSource.addFeature(userFeature);

    // --- Função de Busca (Revertida para padrão) ---
    const loadHospitals = async () => {
      if (!mapRef.current) return;
      map.updateSize();
      
      const size = map.getSize();
      if (!size) {
        setIsLoading(false);
        return;
      }

      const view = map.getView();
      const extent = view.calculateExtent(size);
      
      try {
        const rawData = await fetchHospitalsFromOSM(extent);
        const enrichedData = rawData.map(enrichHospitalData);
        
        if (!mapRef.current) return;
        
        setHospitals(enrichedData); 
        if (onHospitalsFound) onHospitalsFound(enrichedData);
        
        hospitalSource.clear(); 

        // Cria pinos para TODOS os dados que chegaram
        const features = enrichedData.map((hospital) => {
            const feature = new Feature({
              geometry: new Point(fromLonLat([hospital.coordinates.x, hospital.coordinates.y])),
              name: hospital.name,
            });
            feature.setStyle(
              new Style({
                image: new Circle({
                  radius: 8,
                  fill: new Fill({ color: getPinColor(hospital.status) }),
                  stroke: new Stroke({ color: 'white', width: 2 }),
                }),
              })
            );
            return feature;
        });

        // Adiciona tudo de uma vez
        if (features.length > 0) {
          hospitalSource.addFeatures(features);
        }

      } catch (error) {
        console.error("Erro", error);
      } finally {
        setIsLoading(false);
      }
    };

    const resizeObserver = new ResizeObserver(() => mapRef.current?.updateSize());
    resizeObserver.observe(mapElement.current);

    map.on('moveend', () => { 
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setIsLoading(true); // Loading
      debounceTimer.current = setTimeout(loadHospitals, 300); 
    });

    setIsLoading(true);
    const initTimeout = setTimeout(loadHospitals, 500);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(initTimeout);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  return (
    <div>
      <Card className="p-0 border-gray-200 overflow-hidden relative">
        <div ref={mapElement} className="w-full h-[500px] bg-gray-100" />
        
        <div 
          ref={tooltipElement} 
          className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none hidden z-50 whitespace-nowrap shadow-lg"
        />

        {/* Aviso de Carregamento */}
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