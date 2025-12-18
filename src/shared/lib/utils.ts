import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusInfo = (status: string) => {
    switch (status) {
      case 'low': return { color: 'bg-green-500', text: 'text-green-700', label: 'Vazio', desc: 'Atendimento rápido' };
      case 'medium': return { color: 'bg-yellow-500', text: 'text-yellow-700', label: 'Moderado', desc: 'Espera moderada' };
      case 'high': return { color: 'bg-red-500', text: 'text-red-700', label: 'Cheio', desc: 'Alta demanda' };
      default: return { color: 'bg-gray-500', text: 'text-gray-700', label: 'Desconhecido', desc: '' };
    }
  };


