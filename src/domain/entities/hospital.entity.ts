export interface Hospital {
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

export type HospitalStatus = Hospital['status'];
