import { Card } from "@/components/ui/card"
import { MapaApi } from "@/features/mapa/MapaApi"
import { hospitals } from "./HospitaisLista";

export default function MapaHospitaisMap() {
  return (
    <div>        
      <Card className="p-0 border-gray-200 overflow-hidden">
          <div className="w-full h-[500px] rounded-lg overflow-hidden border">
  <MapaApi hospitals={hospitals} />
</div>
          {/* Map Legend */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-gray-700">Você está aqui</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Vazio</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">Moderado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-700">Cheio</span>
              </div>
            </div>
          </div>
        </Card></div>
  )
}