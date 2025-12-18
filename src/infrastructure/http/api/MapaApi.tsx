import { transformExtent } from 'ol/proj';
// IMPORTANTE: Agora importamos o tipo do Domínio, não definimos aqui!
import type { Hospital } from "@/domain/entities/Hospital"; 
import type { BoundingBox } from "@/domain/repositories/IHospitalRepository";

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

// Função auxiliar para converter o BoundingBox do domínio para o formato do OSM
// (Isso isola a lógica de conversão aqui dentro)
function convertBBoxToOverpass(bbox: number[]): [number, number, number, number] | null {
  const extentLonLat = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
  const [west, south, east, north] = extentLonLat;

  // Proteção contra áreas gigantes
  if (Math.abs(north - south) > 2 || Math.abs(east - west) > 2) {
    console.warn("Área muito grande, abortando busca.");
    return null;
  }
  return [west, south, east, north];
}

export const fetchHospitalsFromOSM = async (
  extent: number[], 
  signal?: AbortSignal
): Promise<Hospital[]> => {
  
  const coords = convertBBoxToOverpass(extent);
  if (!coords) return [];

  const [west, south, east, north] = coords;

  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="hospital"](${south},${west},${north},${east});
      way["amenity"="hospital"](${south},${west},${north},${east});
      relation["amenity"="hospital"](${south},${west},${north},${east});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: query,
      signal: signal,
    });

    if (!response.ok) {
      throw new Error(`Erro na API do OSM: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (text.trim().startsWith("<")) {
      throw new Error("A API retornou HTML (Erro 504/Gateway).");
    }

    const data = JSON.parse(text);

    // Mapeia para o tipo Hospital do DOMÍNIO
    return data.elements.map((element: any): Hospital => {
      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;
      const tags = element.tags || {};

      let fullAddress = "Endereço não informado";
      if (tags['addr:street']) {
        fullAddress = `${tags['addr:street']}`;
        if (tags['addr:housenumber']) fullAddress += `, ${tags['addr:housenumber']}`;
        if (tags['addr:suburb']) fullAddress += ` - ${tags['addr:suburb']}`;
      } else if (tags.address) {
         fullAddress = tags.address;
      }

      return {
        id: String(element.id), // Converta para string se seu Domínio pede string
        name: tags.name || "Hospital (Sem nome)",
        address: fullAddress,
        coordinates: { x: lon, y: lat },
      };
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log("Requisição cancelada.");
      return []; 
    }
    console.error("Erro OSM:", error.message);
    return [];
  }
};