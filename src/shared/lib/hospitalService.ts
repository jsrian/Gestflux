import type { Hospital } from "@/domain/entities/Hospital";
import type { EnrichedHospital, HospitalStatus } from "@/domain/entities/Hospital";

// Função auxiliar interna para calcular metros
const calculateRawDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Raio da Terra em metros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return Math.round(R * c); // Retorna inteiro em metros
};

// Função formatadora (usa a de cima)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const distMeters = calculateRawDistance(lat1, lon1, lat2, lon2);
  if (distMeters < 1000) {
    return `${distMeters} m`;
  }
  return `${(distMeters / 1000).toFixed(1)} km`;
};

// Lógica de Negócio: Enriquecer os dados
export const enrichHospitalData = (hospital: Hospital, userLat: number, userLon: number): EnrichedHospital => {
  const statuses: HospitalStatus[] = ['empty', 'moderate', 'full'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Calcula a distância bruta em metros
  const distMeters = calculateRawDistance(userLat, userLon, hospital.coordinates.y, hospital.coordinates.x);

  return {
    ...hospital,
    status,
    queueSize: Math.floor(Math.random() * 20),
    waitingTime: "30 min",
    rawDistance: distMeters, 
    distance: distMeters < 1000 ? `${distMeters} m` : `${(distMeters / 1000).toFixed(1)} km`,
    address: hospital.address,
    specialties: ["Geral", "Trauma"]
  };
};

// Helper visual para cor 
export const getPinColor = (status: string) => {
  switch (status) {
    // 4. CORREÇÃO: Atualizado para os novos nomes do Domínio
    case 'empty': return '#22c55e';    // Era 'low'
    case 'moderate': return '#eab308'; // Era 'medium'
    case 'full': return '#ef4444';     // Era 'high'
    default: return '#94a3b8';
  }
};