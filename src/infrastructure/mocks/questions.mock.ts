export interface TriageOption {
  label: string;
  score: number;
  isEmergency?: boolean; // Se true, para o quiz e manda pro hospital na hora
}

export interface TriageQuestion {
  id: number;
  text: string;
  options: TriageOption[];
}

export const triageQuestions: TriageQuestion[] = [
  {
    id: 1,
    text: "Você está sentindo falta de ar intensa ou dor no peito?",
    options: [
      { label: "Sim, muita falta de ar / Dor forte", score: 10, isEmergency: true },
      { label: "Um pouco de desconforto", score: 5 },
      { label: "Não", score: 0 },
    ],
  },
  {
    id: 2,
    text: "Você sofreu algum acidente ou trauma físico recente?",
    options: [
      { label: "Sim, com sangramento intenso", score: 10, isEmergency: true },
      { label: "Sim, mas sem sangramento grave", score: 5 },
      { label: "Não", score: 0 },
    ],
  },
  {
    id: 3,
    text: "Qual a intensidade da sua dor (0 a 10)?",
    options: [
      { label: "Insuportável (8-10)", score: 8 },
      { label: "Moderada (4-7)", score: 4 },
      { label: "Leve (0-3)", score: 1 },
    ],
  },
  {
    id: 4,
    text: "Você tem febre alta (acima de 39°C)?",
    options: [
      { label: "Sim, e não baixa com remédio", score: 6 },
      { label: "Sim, mas controlada", score: 3 },
      { label: "Não", score: 0 },
    ],
  },
];