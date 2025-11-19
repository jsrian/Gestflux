import { MapPin, Users, Clock, Navigation, Phone, } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapaApi } from "./MapaApi";

interface Hospital {
  id: number;
  name: string;
  address: string;
  waitingTime: string;
  queueSize: number;
  status: 'low' | 'medium' | 'high';
  coordinates: { x: number; y: number };
  specialties: string[];
  phone: string;
  distance: string;
}


// Hospitais reais de João Pessoa
const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Hospital de Emergência e Trauma Senador Humberto Lucena",
    address: "Av. Sanitarista Nilo Batista, Centro - João Pessoa",
    waitingTime: "25 min",
    queueSize: 18,
    status: 'medium',
    coordinates: { x: 45, y: 55 },
    specialties: ["emergência", "trauma", "cirurgia", "neurologia"],
    phone: "(83) 3218-7070",
    distance: "8.2 km"
  },
  {
    id: 2,
    name: "Hospital Universitário Lauro Wanderley",
    address: "Campus I UFPB, Cidade Universitária - João Pessoa",
    waitingTime: "45 min",
    queueSize: 32,
    status: 'high',
    coordinates: { x: 35, y: 40 },
    specialties: ["clínica geral", "cardiologia", "pediatria", "ginecologia"],
    phone: "(83) 3216-7777",
    distance: "12.5 km"
  },
  {
    id: 3,
    name: "Hospital Metropolitano",
    address: "Rua Dep. Odon Bezerra, Santa Rosa - João Pessoa",
    waitingTime: "15 min",
    queueSize: 8,
    status: 'low',
    coordinates: { x: 65, y: 30 },
    specialties: ["emergência", "cardiologia", "neurologia", "ortopedia"],
    phone: "(83) 3216-4000",
    distance: "4.8 km"
  },
  {
    id: 4,
    name: "Complexo Hospitalar de Mangabeira",
    address: "Rua Projetada, Mangabeira VIII - João Pessoa",
    waitingTime: "35 min",
    queueSize: 24,
    status: 'medium',
    coordinates: { x: 25, y: 75 },
    specialties: ["clínica geral", "pediatria", "ginecologia", "psiquiatria"],
    phone: "(83) 3212-3000",
    distance: "15.3 km"
  },
  {
    id: 5,
    name: "Hospital Santa Isabel",
    address: "Av. Gen. Edson Ramalho, Manaíra - João Pessoa",
    waitingTime: "20 min",
    queueSize: 12,
    status: 'low',
    coordinates: { x: 75, y: 20 },
    specialties: ["cardiologia", "neurologia", "ortopedia", "consultas"],
    phone: "(83) 2107-4444",
    distance: "1.2 km"
  },
  {
    id: 6,
    name: "Hospital Português",
    address: "Av. Dom Pedro II, Torre - João Pessoa",
    waitingTime: "30 min",
    queueSize: 16,
    status: 'medium',
    coordinates: { x: 55, y: 35 },
    specialties: ["clínica geral", "cardiologia", "gastroenterologia", "urologia"],
    phone: "(83) 2107-2500",
    distance: "6.5 km"
  }
];



const getStatusColor = (status: string) => {
  switch (status) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'low':
      return 'Vazio';
    case 'medium':
      return 'Moderado';
    case 'high':
      return 'Cheio';
    default:
      return 'Desconhecido';
  }
};

const getStatusDescription = (status: string) => {
  switch (status) {
    case 'low':
      return 'Atendimento rápido disponível';
    case 'medium':
      return 'Tempo de espera moderado';
    case 'high':
      return 'Alta demanda no momento';
    default:
      return '';
  }
};

export default function MapaHospitais() {

  return (
    
    <div className="min-h-screen bg-gray-50">

      {/* Content - Desktop e Mobile */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header - Desktop */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Hospitais em João Pessoa</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">Sua localização: Manaíra, João Pessoa - PB</p>
          </div>
        </div>

        {/* Header - Mobile */}
        <div className="md:hidden mb-4">
          <h1 className="text-xl font-medium text-gray-900 mb-1">Hospitais em João Pessoa</h1>
          <p className="text-sm text-gray-600">Sua localização: Manaíra, João Pessoa - PB</p>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Hospitais Vazios</p>
                <p className="text-2xl font-semibold text-green-900 mt-1">
                  {hospitals.filter(h => h.status === 'low').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Atendimento rápido</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Filas Moderadas</p>
                <p className="text-2xl font-semibold text-yellow-900 mt-1">
                  {hospitals.filter(h => h.status === 'medium').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Espera moderada</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Hospitais Cheios</p>
                <p className="text-2xl font-semibold text-red-900 mt-1">
                  {hospitals.filter(h => h.status === 'high').length}
                </p>
                <p className="text-xs text-red-600 mt-1">Alta demanda</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Layout: Sidebar (Desktop) + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Informações e Mapa (Desktop: 2 colunas, Mobile: tudo) */}
          <div className="lg:col-span-2 space-y-6"><span> <div className="w-full h-[500px] rounded-lg overflow-hidden border">
  <MapaApi hospitals={hospitals} />
</div>
</span>



        {/* Map Container */}
        <Card className="p-0 border-gray-200 overflow-hidden">

          {/* Map Legend */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-700">Você está aqui</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Vazio</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">Moderado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-700">Cheio</span>
              </div>
            </div>
          </div>
        </Card>

          </div>

          {/* Coluna Direita - Lista de Hospitais (Desktop: 1 coluna, Mobile: abaixo do mapa) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Todos os Hospitais</h3>
                  <p className="text-xs text-gray-500 mt-1">{hospitals.length} hospitais • Ordenados por fila</p>
                </div>
                
                <div className="max-h-[600px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
                  {hospitals
                    .sort((a, b) => a.queueSize - b.queueSize)
                    .map((hospital) => (
                    <div 
                      key={hospital.id} 
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm leading-tight pr-2">{hospital.name}</h4>
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
                              <p>{hospital.distance} do Manaíra</p>
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
                          
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-3 border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Ligar
                          </Button>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {hospital.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}