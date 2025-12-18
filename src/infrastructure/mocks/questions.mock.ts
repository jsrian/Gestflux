import type { Question } from "@/domain/entities/question.entity";

export const questions: Question[] = [
  {
    id: 1,
    text: "Qual a intensidade da dor?",
    options: [
      { label: "Nenhuma", weight: 0 },
      { label: "Leve", weight: 1 },
      { label: "Moderada", weight: 2 },
      { label: "Intensa", weight: 3 }
    ]
  },
  {
    id: 2,
    text: "Você tem dificuldade para respirar?",
    options: [
      { label: "Não", weight: 0 },
      { label: "Um pouco", weight: 2 },
      { label: "Sim", weight: 4 }
    ]
  }
];
