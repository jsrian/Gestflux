import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar2 from "../components/layout/NavBarV2";

import { triageQuestions } from "../../infrastructure/mocks/questions.mock"; 

export default function Perguntas() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const currentQuestion = triageQuestions[currentStep]; 

  const handleAnswer = (score: number, isEmergency?: boolean) => {
    if (isEmergency) {
      navigate("/mapa?urgency=high");
      return;
    }

    const newScore = totalScore + score;
    setTotalScore(newScore);

    // Verifica o tamanho da lista importada
    if (currentStep < triageQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTriage(newScore);
    }
  };

  const finishTriage = (finalScore: number) => {
    let urgency = "low";
    if (finalScore >= 15) urgency = "high"; 
    else if (finalScore >= 6) urgency = "medium";
    
    navigate(`/mapa?urgency=${urgency}`);
  };

  return (
    <>
      <Navbar2 />
<div className="min-h-screen bg-[#12726E] flex flex-col items-center justify-center p-5">
        
        {/* Barra de Progresso dinâmica baseada na lista importada */}
        <div className="w-full max-w-md mb-8 flex gap-2">
          {triageQuestions.map((_, idx) => (
            <div key={idx} className={`h-2 flex-1 rounded-full ${idx <= currentStep ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>

        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-300">
          <h2 className="text-xl font-bold text-[#1b756f] mb-6">
            {currentQuestion.text}
          </h2>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.score, option.isEmergency)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-[#1b756f] hover:bg-[#1b756f]/10 transition-all font-medium text-gray-700 flex justify-between items-center group"
              >
                {option.label}
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#1b756f]" />
              </button>
            ))}
          </div>
        </div>

        <button 
          className="mt-12 bg-white text-[#1b756f] px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition-all" 
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </div>
    </>
  );
}