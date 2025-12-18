import { transformExtent } from 'ol/proj';

export interface Hospital {
  id: number;
  name: string;
  coordinates: { x: number; y: number };
}

export const fetchHospitalsFromOSM = async (extent: number[]): Promise<Hospital[]> => {
  const extentLonLat = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
  
  const [west, south, east, north] = extentLonLat;

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](${south},${west},${north},${east});
      way["amenity"="hospital"](${south},${west},${north},${east});
      relation["amenity"="hospital"](${south},${west},${north},${east});
    );
    out center;
  `;

  try {
    const response = await fetch("[https://overpass-api.de/api/interpreter](https://overpass-api.de/api/interpreter)", {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    return data.elements.map((element: any) => {
      const lat = element.lat || element.center?.lat;
      const lon = element.lon || element.center?.lon;

      return {
        id: element.id,
        name: element.tags.name || "Hospital sem nome",
        coordinates: {
          x: lon,
          y: lat,
        },
      };
    });
  } catch (error) {
    console.error("Erro ao buscar hospitais:", error);
    return [];
  }
};