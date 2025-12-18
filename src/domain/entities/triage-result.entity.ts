export type TriageLevel = "low" | "medium" | "high";

export interface TriageResult {
  level: TriageLevel;
  score: number;
  description: string;
}
