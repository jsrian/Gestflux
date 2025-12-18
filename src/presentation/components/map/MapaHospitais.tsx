import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import HospitaisHeader from "./HospitaisHeader";
import HospitaisLista from "./HospitaisLista";
import StatusCards from "./StatusCards";
import MapaHospitaisMap from "./MapaHospitaisMap";
import type { EnrichedHospital } from "@/domain/entities/Hospital";

export default function MapaHospitais() {
  const [hospitalsList, setHospitalsList] = useState<EnrichedHospital[]>([]);
  
  // Lendo o parâmetro da URL (ex: /mapa?urgency=high)
  const [searchParams] = useSearchParams();
  const urgencyParam = searchParams.get('urgency'); 

  const handleHospitalsFound = useCallback((data: EnrichedHospital[]) => {
    setHospitalsList(data);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 relative ">
      <HospitaisHeader  />

      {/* Alerta de Urgência Alta */}
      {urgencyParam === 'full' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mt-4 mb-6 flex items-center gap-3 animate-pulse ">
          <div className="w-4 h-4 rounded-full bg-red-600 "></div>
          <div>
            <p className="font-bold">Emergência Detectada</p>
            <p className="text-sm shadow-xl">Procure os hospitais com o marcador VERDE (Vazio) para atendimento imediato.</p>
          </div>
        </div>
      )}

      {/* Alerta de Urgência Média */}
      {urgencyParam === 'moderate' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mt-4 mb-6 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-yellow-600" ></div>
          <p className="text-sm font-medium shadow-xl">Recomendamos evitar hospitais cheios.</p>
        </div>
      )}

      <StatusCards hospitals={hospitalsList} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 ">
        <div className="lg:col-span-2">
           <MapaHospitaisMap onHospitalsFound={handleHospitalsFound} />
        </div>
        <HospitaisLista hospitals={hospitalsList} />
      </div>
    </div>
  );
}