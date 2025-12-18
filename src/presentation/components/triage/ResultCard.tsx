import { Card } from "@/presentation/components/ui/card";
import type { TriageResult } from "@/domain/entities/triage-result.entity";

interface ResultCardProps {
  result: TriageResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className={`p-6 ${colors[result.level]}`}>
        <h2 className="text-xl font-semibold mb-2">
          Resultado da Triagem
        </h2>

        <p className="text-lg font-medium capitalize">
          Urgência {result.level}
        </p>

        <p className="mt-2">
          {result.description}
        </p>

        <p className="text-sm mt-4 opacity-80">
          Pontuação total: {result.score}
        </p>
      </Card>
    </div>
  );
}
