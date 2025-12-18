import type { Hospital } from '../../presentation/components/map/MapaApi';

// Definição do tipo enriquecido (movido para cá para ser reutilizável)
export interface EnrichedHospital extends Hospital {
  status: 'low' | 'medium' | 'high';
  queueSize: number;
  waitingTime: string;
  distance: string;
  address: string;
  specialties: string[];
}

// 1. Função Pura de Cálculo de Distância (Haversine)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

// 2. Lógica de Negócio: Enriquecer os dados
export const enrichHospitalData = (hospital: Hospital, userLat: number, userLon: number): EnrichedHospital => {
  const statuses: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const realDistance = calculateDistance(userLat, userLon, hospital.coordinates.y, hospital.coordinates.x);

  return {
    ...hospital,
    status,
    queueSize: Math.floor(Math.random() * 20),
    waitingTime: "30 min",
    distance: realDistance,
    address: hospital.address,
    specialties: ["Geral", "Trauma"]
  };
};

// 3. Helper visual para cor (Opcional mover pra cá, mas ajuda a limpar)
export const getPinColor = (status: string) => {
  switch (status) {
    case 'low': return '#22c55e';    
    case 'medium': return '#eab308'; 
    case 'high': return '#ef4444';   
    default: return '#94a3b8';
  }
};