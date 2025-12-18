import { transformExtent } from 'ol/proj';

export interface Hospital {
  id: number;
  name: string;
  coordinates: { x: number; y: number };
  address: string;
}

// Lista de servidores mirrors do Overpass (se um falhar, poderíamos tentar outro, 
// mas aqui vamos usar o Kumi Systems que costuma ser rápido, ou manter o principal).
const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";
// Alternativa: "https://interpreter.roadicator.com/api/interpreter"

export const fetchHospitalsFromOSM = async (
  extent: number[], 
  signal?: AbortSignal // <--- NOVO: Permite cancelar a requisição
): Promise<Hospital[]> => {
  const extentLonLat = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  const [west, south, east, north] = extentLonLat;

  // Proteção: Se a área for o mundo todo (zoom muito longe), não busca nada para não travar
  if (Math.abs(north - south) > 2 || Math.abs(east - west) > 2) {
    console.warn("Área muito grande, abortando busca para evitar timeout.");
    return [];
  }

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
      signal: signal, // Liga o cancelamento
    });

    // 1. Verifica se o servidor respondeu com sucesso (200 OK)
    if (!response.ok) {
      throw new Error(`Erro na API do OSM: ${response.status} ${response.statusText}`);
    }

    // 2. Tenta ler o texto primeiro para garantir que é JSON
    const text = await response.text();
    
    // Se a resposta começar com "<", é HTML de erro (504/502), não JSON.
    if (text.trim().startsWith("<")) {
      throw new Error("A API retornou HTML em vez de JSON (Provável erro 504/Gateway).");
    }

    const data = JSON.parse(text);

    return data.elements.map((element: any) => {
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
        id: element.id,
        name: tags.name || "Hospital (Sem nome)",
        address: fullAddress,
        coordinates: { x: lon, y: lat },
      };
    });

  } catch (error: any) {
    // Se o erro foi "AbortError", é porque o usuário moveu o mapa e cancelamos de propósito.
    // Não precisa sujar o console com erro vermelho.
    if (error.name === 'AbortError') {
      console.log("Requisição anterior cancelada (movimento do mapa).");
      return []; 
    }
    
    console.error("Erro ao buscar hospitais:", error.message);
    return [];
  }
};