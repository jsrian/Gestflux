import { useState } from "react";

import { questions } from "@/infrastructure/mocks/questions.mock";
import { calculateTriageResult } from "@/domain/services/triage.service";

import ProgressBar from "@/presentation/components/triage/ProgressBar";
import QuestionCard from "@/presentation/components/triage/QuestionCard";
import ResultCard from "@/presentation/components/triage/ResultCard";
import NavbarV2 from "@/presentation/components/layout/NavBarV2";

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

  if (finished) {
    const result = calculateTriageResult(score);
    return (
      <>
        <NavbarV2 />
        <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 space-y-6">
          <ResultCard result={result} />

          <a
            href="/mapa"
            className="
      bg-[#1b756f]
      text-white
      px-8
      py-3
      rounded-full
      font-bold
      text-center
      inline-block
    "
          >
            Ver Hospitais
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarV2 />

      <div className="min-h-screen pt-16 flex flex-col justify-center px-4">
        <div className="w-full max-w-md md:max-w-xl mx-auto space-y-6">
          <ProgressBar current={current} total={questions.length} />

          <QuestionCard question={questions[current]} onAnswer={handleAnswer} />
        </div>
      </div>
    </>
  );
}
