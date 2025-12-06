import HospitaisHeader from "./HospitaisHeader";
import HospitaisLista from "./HospitaisLista";
import StatusCards from "./StatusCards";
import MapaHospitaisMap from "./MapaHospitaisMap";

export default function MapaHospitais() {

  return (
    <div className="min-h-screen bg-gray-50">
    <HospitaisHeader
    />
    <StatusCards />
    <MapaHospitaisMap />
    <HospitaisLista />
    </div>
  )
}