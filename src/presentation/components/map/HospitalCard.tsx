import { memo } from "react";
import { MapPin, Navigation, Clock, Users, Map as MapIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { EnrichedHospital } from "@/shared/lib/hospitalService";
import { getStatusInfo } from "@/shared/lib/utils";

const ORIGEM_MANAIRA = { lat: -7.100608, lon: -34.837581 };

interface HospitalCardProps {
  hospital: EnrichedHospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  
  const handleRouteClick = () => {
    const origin = `${ORIGEM_MANAIRA.lat},${ORIGEM_MANAIRA.lon}`;
    const destination = `${hospital.coordinates.y},${hospital.coordinates.x}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const statusInfo = getStatusInfo(hospital.status);

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <div className="space-y-3">
        {/* Cabeçalho */}
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

        {/* Rodapé: Stats + Botão */}
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

        {/* Tags */}
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
};

export default memo(HospitalCard);