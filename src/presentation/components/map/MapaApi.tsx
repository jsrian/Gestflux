// MapaApi.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapaApiProps {
  hospitals: {
    id: number;
    name: string;
    coordinates: { x: number; y: number };
  }[];
}

export function MapaApi({ hospitals }: MapaApiProps) {
  const center: [number, number] = [-7.11532, -34.861]; // João Pessoa

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution={`&copy; OpenStreetMap contributors`}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.coordinates.x, hospital.coordinates.y]}
          icon={icon}
        >
          <Popup>{hospital.name}</Popup>
        </Marker>
      ))}
      
    </MapContainer>
  );
}
