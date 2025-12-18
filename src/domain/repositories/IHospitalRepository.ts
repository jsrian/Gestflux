import type { Hospital } from "../entities/Hospital";

// Define um "Bounding Box" genérico para não depender de tipos do OpenLayers aqui
export interface BoundingBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export interface IHospitalRepository {
  /**
   * Busca hospitais dentro de uma área geográfica (Bounding Box).
   * Retorna hospitais "crus" (sem cálculo de fila ainda).
   */
  findHospitalsInArea(bbox: BoundingBox, signal?: AbortSignal): Promise<Hospital[]>;
}