import { useState } from "react";

import { questions } from "@/infrastructure/mocks/questions.mock";
import { calculateTriageResult } from "@/domain/services/triage.service";

import ProgressBar from "@/presentation/components/triage/ProgressBar";
import QuestionCard from "@/presentation/components/triage/QuestionCard";
import ResultCard from "@/presentation/components/triage/ResultCard";


export default function Questionario() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleAnswer(weight: number) {
    const newScore = score + weight;
    setScore(newScore);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  }

  // 🔴 É EXATAMENTE AQUI 👇 (ANTES DO RETURN)
  if (finished) {
    const result = calculateTriageResult(score);
    return <ResultCard result={result} />;
  }

  // ⬇️ RETURN NORMAL (quando ainda NÃO terminou)
  return (
    <div className="max-w-xl mx-auto mt-10">
      <ProgressBar
        current={current}
        total={questions.length}
      />

      <QuestionCard
        question={questions[current]}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
