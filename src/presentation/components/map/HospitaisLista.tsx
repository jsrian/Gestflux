import { MapPin, Navigation, Clock, Users, Map } from "lucide-react"; // Adicionei 'Map'
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { EnrichedHospital } from "./MapaHospitaisMap"; // Importe a tipagem correta do Mapa

interface HospitaisListaProps {
  hospitals: EnrichedHospital[];
}
const ORIGEM_FIXA_LAT = -7.1153;  // João Pessoa
const ORIGEM_FIXA_LON = -34.8631; // João Pessoa

// Funções auxiliares de renderização (Cores e Textos)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'low': return 'Vazio';
    case 'medium': return 'Moderado';
    case 'high': return 'Cheio';
    default: return 'Desconhecido';
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case 'low': return 'Atendimento rápido disponível';
    case 'medium': return 'Tempo de espera moderado';
    case 'high': return 'Alta demanda no momento';
    default: return '';
  }
};

export default function HospitaisLista({ hospitals }: HospitaisListaProps) {
  
  // Origem fixa
  const openGoogleMapsRoute = (destLat: number, destLon: number) => {
    // Monta a URL com Origem (origin) e Destino (destination) explícitos
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ORIGEM_FIXA_LAT},${ORIGEM_FIXA_LON}&destination=${destLat},${destLon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-20">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Hospitais na Área</h3>
            <p className="text-xs text-gray-500 mt-1">
              {hospitals.length} hospitais encontrados
            </p>
          </div>

          <div className="max-h-[600px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
            {hospitals.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Mova o mapa para encontrar hospitais nesta região.
              </div>
            ) : (
              hospitals
                .sort((a, b) => a.queueSize - b.queueSize) // Ordena por tamanho da fila
                .map((hospital) => (
                <div
                  key={hospital.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">
                            {hospital.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(hospital.status)}`}></div>
                            <span className={`text-xs font-medium ${
                              hospital.status === 'low' ? 'text-green-700' :
                              hospital.status === 'medium' ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {getStatusDescription(hospital.status)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(hospital.status)} text-white text-xs shrink-0`}
                        >
                          {getStatusText(hospital.status)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <p className="line-clamp-2">{hospital.address}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 shrink-0" />
                          <p>{hospital.distance} do seu local</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-600" />
                          <span className="text-xs text-gray-900">{hospital.waitingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-600" />
                          <span className="text-xs text-gray-900">{hospital.queueSize}</span>
                        </div>
                      </div>
                      
                      {/* ÁREA DOS BOTÕES */}
                      <div className="flex gap-2">

                        {/*Botão de Rota */}
                        <Button
                          size="sm"
                          // coordinates.y = Latitude, coordinates.x = Longitude
                          onClick={() => openGoogleMapsRoute(hospital.coordinates.y, hospital.coordinates.x)}
                          className="text-xs h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white gap-1"
                        >
                          <Map className="w-3 h-3" />
                          Rota
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      {hospital.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}