import { memo } from 'react';
import { Card } from "@/presentation/components/ui/card";
import { Loader2 } from "lucide-react"; 
import { useHospitalMap } from '@/presentation/http/view-models/useHospitalMap'; // Importe o hook criado
import type { EnrichedHospital } from "@/domain/entities/Hospital";

interface MapaProps {
  onHospitalsFound?: (hospitals: EnrichedHospital[]) => void;
}

function MapaHospitaisMapComponent({ onHospitalsFound }: MapaProps) {
  const { mapContainerRef, tooltipRef, hospitals, isLoading } = useHospitalMap({ onHospitalsFound });

  return (
    <div>
      <Card className="p-0 border-gray-200 overflow-hidden relative">
        {/* Container do Mapa */}
        <div ref={mapContainerRef} className="w-full h-[500px] bg-gray-100" />
        
        {/* Tooltip (Controlado pelo Hook via Ref) */}
        <div ref={tooltipRef} className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none hidden z-50 whitespace-nowrap" />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs font-semibold text-gray-700">Buscando locais...</span>
          </div>
        )}

        {/* Rodapé com Legenda */}
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