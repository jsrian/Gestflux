import { useMemo, memo } from "react";
import { MapPin, Navigation, Clock, Users, Map as MapIcon } from "lucide-react"; 
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { EnrichedHospital } from "@/shared/lib/hospitalService";
import { getStatusInfo } from "@/shared/lib/utils";

const ORIGEM_MANAIRA = { lat: -7.100608, lon: -34.837581 };

interface HospitaisListaProps {
  hospitals: EnrichedHospital[];
}

const HospitalCard = memo(({ hospital }: { hospital: EnrichedHospital }) => {
  

  const handleRouteClick = () => {
    // URL Oficial da API de Direções do Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ORIGEM_MANAIRA.lat},${ORIGEM_MANAIRA.lon}&destination=${hospital.coordinates.y},${hospital.coordinates.x}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const statusInfo = getStatusInfo(hospital.status);

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <div className="space-y-3">
        {/* Cabeçalho do Card */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2 group-hover:text-blue-700 transition-colors">
              {hospital.name}
            </h4>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
              <span className={`text-xs font-medium ${statusInfo.text}`}>
                {statusInfo.desc}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className={`${statusInfo.color} text-white text-xs shrink-0`}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Informações de Local */}
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
            <p className="line-clamp-2">{hospital.address}</p>
          </div>
          <div className="flex items-center gap-1">
            <Navigation className="w-3 h-3 shrink-0" />
            <p>{hospital.distance} de você</p>
          </div>
        </div>

        {/* Rodapé do Card: Stats + Botão */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Tempo de Espera">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-900">{hospital.waitingTime}</span>
            </div>
            <div className="flex items-center gap-1" title="Pessoas na fila">
              <Users className="w-3 h-3 text-gray-600" />
              <span className="text-xs text-gray-900">{hospital.queueSize}</span>
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={handleRouteClick}
            className="text-xs h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white gap-1 shadow-sm"
          >
            <MapIcon className="w-3 h-3" />
            Rota
          </Button>
        </div>

        {/* Tags de Especialidade */}
        <div className="flex gap-1 flex-wrap mt-2">
          {hospital.specialties.map((specialty, index) => (
            <span key={index} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

// --- COMPONENTE PRINCIPAL ---
export default function HospitaisLista({ hospitals }: HospitaisListaProps) {
  
  // 1. Performance: Só reordena se a lista de hospitais mudar
  const sortedHospitals = useMemo(() => {
    return [...hospitals].sort((a, b) => a.queueSize - b.queueSize);
  }, [hospitals]);

  return (
    <div className="lg:col-span-1 h-full">
      <div className="lg:sticky lg:top-20 flex flex-col h-full max-h-[calc(100vh-100px)]">
        
        {/* Header da Lista */}
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

        {/* Corpo da Lista (Scrollável) */}
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