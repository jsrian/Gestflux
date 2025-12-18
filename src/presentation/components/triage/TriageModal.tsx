import { useState } from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { AlertTriangle, CheckCircle, Ambulance } from "lucide-react";
import { triageQuestions, type TriageOption } from "@/infrastructure/mocks/questions.mock";

interface TriageModalProps {
  onComplete: (urgencyLevel: 'high' | 'medium' | 'low') => void;
  onClose: () => void;
}

export default function TriageModal({ onComplete, onClose }: TriageModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [urgencyResult, setUrgencyResult] = useState<'high' | 'medium' | 'low'>('low');

  const handleAnswer = (option: TriageOption) => {
    // 1. Verifica se é uma emergência imediata (Red Flag)
    if (option.isEmergency) {
      setUrgencyResult('high');
      setShowResult(true);
      return;
    }

    const newScore = totalScore + option.score;
    setTotalScore(newScore);

    // 2. Se tiver mais perguntas, avança. Se não, calcula o resultado.
    if (currentQuestionIndex < triageQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateFinalResult(newScore);
    }
  };

  const calculateFinalResult = (score: number) => {
    // Lógica simples de pontuação
    if (score >= 10) {
      setUrgencyResult('high');
    } else if (score >= 5) {
      setUrgencyResult('medium');
    } else {
      setUrgencyResult('low');
    }
    setShowResult(true);
  };

  const finishTriage = () => {
    onComplete(urgencyResult);
    onClose();
  };

  // --- Renderização da TELA DE RESULTADO ---
  if (showResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <Card className="w-full max-w-md p-6 bg-white shadow-xl animate-in fade-in zoom-in duration-300">
          <div className="text-center space-y-4">
            {urgencyResult === 'high' && (
              <>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Ambulance className="w-8 h-8 text-red-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-red-700">Emergência Médica</h2>
                <p className="text-gray-600">Seus sintomas indicam uma condição grave. Dirija-se imediatamente a um hospital.</p>
              </>
            )}
            
            {urgencyResult === 'medium' && (
              <>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-700">Atendimento Necessário</h2>
                <p className="text-gray-600">Sua situação requer atenção médica, mas não parece ser risco de vida imediato.</p>
              </>
            )}

            {urgencyResult === 'low' && (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700">Baixa Urgência</h2>
                <p className="text-gray-600">Sintomas leves. Considere telemedicina ou agendar uma consulta eletiva.</p>
              </>
            )}

            <Button onClick={finishTriage} className="w-full mt-4" 
              variant={urgencyResult === 'high' ? "destructive" : "default"}>
              Ver Hospitais Recomendados
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- Renderização das PERGUNTAS ---
  const question = triageQuestions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-lg p-6 bg-white shadow-xl">
        <div className="mb-6">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Triagem Virtual • Pergunta {currentQuestionIndex + 1} de {triageQuestions.length}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">{question.text}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
                  {option.label}
                </span>
                <span className="text-gray-400 group-hover:text-blue-500">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 underline">
            Pular Triagem
          </button>
        </div>
      </Card>
    </div>
  );
}