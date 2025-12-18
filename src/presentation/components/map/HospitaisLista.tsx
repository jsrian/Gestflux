import { useMemo } from "react";
import { Navigation } from "lucide-react"; 
import { Badge } from "../ui/badge";
import type { EnrichedHospital } from "@/domain/entities/Hospital";
import HospitalCard from "./HospitalCard";

interface HospitaisListaProps {
  hospitals: EnrichedHospital[];
}

export default function HospitaisLista({ hospitals }: HospitaisListaProps) {
  
  // Lógica de Ordenação
  const sortedHospitals = useMemo(() => {
    return [...hospitals].sort((a, b) => a.queueSize - b.queueSize);
  }, [hospitals]);

  return (
    <div className="lg:col-span-1 h-full">
      <div className="lg:sticky lg:top-20 flex flex-col h-full max-h-[calc(100vh-100px)]">
        
        {/* Header Fixo */}
        <div className="bg-white rounded-t-lg border border-gray-200 border-b-0 overflow-hidden shrink-0">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Hospitais na Área</h3>
              <Badge variant="outline" className="bg-white">
                {hospitals.length} encontrados
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ordenado por menor fila
            </p>
          </div>
        </div>

        {/* Lista Scrollável */}
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg overflow-y-auto flex-1 custom-scrollbar">
          {sortedHospitals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 p-8 text-center text-gray-500 space-y-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm">Nenhum hospital encontrado nesta área.</p>
              <p className="text-xs text-gray-400">Tente mover o mapa para explorar.</p>
            </div>
          ) : (
            sortedHospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}