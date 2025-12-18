import Navbar from "@/presentation/components/layout/Navbar"
import MapaHospitais from "@/presentation/components/map/MapaHospitais"
import Questionario from "./Questionario";

export default function  Home (){
    return (
        <div>
            <Navbar/>
            <MapaHospitais/>
            <Questionario />
        </div>
    )
}