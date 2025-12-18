import { Card } from "@/presentation/components/ui/card"
import { Users, Clock } from "lucide-react";
import type { EnrichedHospital } from "@/domain/entities/Hospital";

interface StatusCardsProps {
  hospitals: EnrichedHospital[];
}

export default function StatusCards({ hospitals }: StatusCardsProps) {
  
  const emptyCount = hospitals.filter(h => h.status === 'empty').length;
  const moderateCount = hospitals.filter(h => h.status === 'moderate').length;
  
  const fullCount = hospitals.filter(h => h.status === 'full').length;

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card Vazios */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Hospitais Vazios</p>
                <p className="text-2xl font-semibold text-green-900 mt-1">
                  {emptyCount}
                </p>
                <p className="text-xs text-green-600 mt-1">Atendimento rápido</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Card Moderados */}
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Filas Moderadas</p>
                <p className="text-2xl font-semibold text-yellow-900 mt-1">
                  {moderateCount}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Espera moderada</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          {/* Card Cheios */}
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Hospitais Cheios</p>
                <p className="text-2xl font-semibold text-red-900 mt-1">
                  {fullCount}
                </p>
                <p className="text-xs text-red-600 mt-1">Alta demanda</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>
      </div>
  )
}