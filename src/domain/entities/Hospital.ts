// src/domain/entities/Hospital.ts

export type HospitalStatus = 'empty' | 'moderate' | 'full';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Hospital {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
}

export interface EnrichedHospital extends Hospital {
  status: HospitalStatus;
  queueSize: number;
  waitingTime: string;
  specialties: string[];
  distance: string;
  rawDistance: number;
}