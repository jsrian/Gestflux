import HospitaisHeader from "./HospitaisHeader";
import HospitaisLista from "./HospitaisLista";
import StatusCards from "./StatusCards";
import MapaHospitaisMap from "./MapaHospitaisMap";

export default function MapaHospitais() {

  return (
<div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
    <HospitaisHeader
    />
    <StatusCards />
    <MapaHospitaisMap />
    <HospitaisLista />
    </div>
  )
}