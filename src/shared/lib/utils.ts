import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { HospitalStatus } from "@/domain/entities/Hospital";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A função recebe o tipo do Domínio
export const getStatusInfo = (status: HospitalStatus) => {
  switch (status) {
    case 'empty': // Antes era 'low'
      return { 
        label: 'Vazio', 
        color: 'bg-green-500', 
        text: 'text-green-700', 
        desc: 'Sem filas' 
      };
    case 'moderate': // Antes era 'medium'
      return { 
        label: 'Moderado', 
        color: 'bg-yellow-500', 
        text: 'text-yellow-700', 
        desc: 'Pouca fila' 
      };
    case 'full': // Antes era 'high'
      return { 
        label: 'Lotado', 
        color: 'bg-red-500', 
        text: 'text-red-700', 
        desc: 'Muita fila' 
      };
    default:
      return { label: 'Desc.', color: 'bg-gray-400', text: 'text-gray-600', desc: '-' };
  }
};

export function getDistance(
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number }
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Raio da Terra em metros
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);
  const deltaLat = toRad(coord2.lat - coord1.lat);
  const deltaLon = toRad(coord2.lon - coord1.lon);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Retorna em metros (inteiro)
}
