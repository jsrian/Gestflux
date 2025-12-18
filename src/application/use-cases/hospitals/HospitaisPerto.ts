import type { IHospitalRepository, BoundingBox } from "../../../domain/repositories/IHospitalRepository";
import type { EnrichedHospital, Hospital, HospitalStatus } from "../../../domain/entities/Hospital";
import { getDistance } from "@/shared/lib/utils";

export class FindNearbyHospitals {

    private hospitalRepository: IHospitalRepository;

  constructor(hospitalRepository: IHospitalRepository) {
    this.hospitalRepository = hospitalRepository;
  }

  async execute(
    bbox: BoundingBox, 
    userLocation: { lat: number; lon: number },
    signal?: AbortSignal
  ): Promise<EnrichedHospital[]> {
    
    const rawHospitals = await this.hospitalRepository.findHospitalsInArea(bbox, signal);

    const enrichedHospitals = rawHospitals.map(hospital => 
      this.enrichHospitalData(hospital, userLocation)
    );

    return enrichedHospitals;
  }

private enrichHospitalData(hospital: Hospital, userLoc: { lat: number; lon: number }): EnrichedHospital {
    const distMeters = getDistance(
      // CORREÇÃO AQUI: Use 'lat' e 'lon' em vez de 'latitude' e 'longitude'
      { lat: userLoc.lat, lon: userLoc.lon },
      { lat: hospital.coordinates.y, lon: hospital.coordinates.x }
    );
    
    const statusValues: HospitalStatus[] = ['empty', 'moderate', 'full'];
    const randomStatus = statusValues[Math.floor(Math.random() * statusValues.length)];
    
    let queue = 0;
    let wait = "0 min";

    if (randomStatus === 'full') {
      queue = Math.floor(Math.random() * 30) + 20;
      wait = "2h+";
    } else if (randomStatus === 'moderate') {
      queue = Math.floor(Math.random() * 15) + 5;
      wait = "45 min";
    } else {
      queue = Math.floor(Math.random() * 5);
      wait = "10 min";
    }


    return {
      ...hospital,
      status: randomStatus,
      queueSize: queue,
      waitingTime: wait,
      specialties: ["Clínico Geral", "Trauma"],
      
      // --- ADICIONE ESTA LINHA ---
      rawDistance: distMeters, // É o número inteiro (ex: 1500), usado para ordenar a lista
      
      distance: distMeters < 1000 ? `${distMeters} m` : `${(distMeters / 1000).toFixed(1)} km`,
    };
  }
}