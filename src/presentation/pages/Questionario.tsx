import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Mudança aqui
import { ArrowRight } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "Você está sentindo falta de ar intensa ou dor no peito?",
    options: [
      { label: "Sim, muita dor/falta de ar", score: 10, isEmergency: true },
      { label: "Desconforto leve", score: 5 },
      { label: "Não", score: 0 },
    ],
  },
  {
    id: 2,
    text: "Houve acidente com sangramento intenso?",
    options: [
      { label: "Sim", score: 10, isEmergency: true },
      { label: "Não", score: 0 },
    ],
  },
  {
    id: 3,
    text: "Qual seu nível de dor (0 a 10)?",
    options: [
      { label: "Insuportável (8-10)", score: 8 },
      { label: "Moderada (4-7)", score: 4 },
      { label: "Leve (0-3)", score: 1 },
    ],
  },
];

export default function Perguntas() {
  const navigate = useNavigate(); // Hook de navegação do React Router
  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const handleAnswer = (score: number, isEmergency?: boolean) => {
    // 1. Emergência Imediata
    if (isEmergency) {
      navigate("/mapa?urgency=high"); // Navegação direta
      return;
    }

    const newScore = totalScore + score;
    setTotalScore(newScore);

    // 2. Próxima pergunta ou Finalizar
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTriage(newScore);
    }
  };

  const finishTriage = (finalScore: number) => {
    let urgency = "low";
    if (finalScore >= 10) urgency = "high";
    else if (finalScore >= 5) urgency = "medium";

    navigate(`/mapa?urgency=${urgency}`);
  };

  const question = questions[currentStep];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#12726E", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      
      {/* Barra de Progresso */}
      <div className="w-full max-w-md mt-10 mb-8 flex gap-2">
        {questions.map((_, idx) => (
          <div key={idx} className={`h-2 flex-1 rounded-full ${idx <= currentStep ? "bg-white" : "bg-white/30"}`} />
        ))}
      </div>

      {/* Card da Pergunta */}
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-bold text-[#12726E] mb-6">
          {question.text}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.score, option.isEmergency)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#12726E] hover:bg-[#12726E]/10 transition-all font-medium text-gray-700 flex justify-between items-center group"
            >
              {option.label}
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#12726E]" />
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className="mt-8 text-white/80 hover:text-white text-sm underline">
        Voltar
      </button>
    </div>
  );
}