import type { TriageResult } from "@/domain/entities/triage-result.entity";

export function calculateTriageResult(score: number): TriageResult {
  if (score >= 6) {
    return {
      level: "high",
      score,
      description: "Procure atendimento imediato."
    };
  }

  if (score >= 3) {
    return {
      level: "medium",
      score,
      description: "Atendimento recomendado em breve."
    };
  }

  return {
    level: "low",
    score,
    description: "Situação estável no momento."
  };
}
