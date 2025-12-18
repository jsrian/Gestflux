import { Button } from "@/presentation/components/ui/button";
import { Card } from "@/presentation/components/ui/card";
import type { Question } from "@/domain/entities/question.entity";

interface Props {
  question: Question;
  onAnswer: (weight: number) => void;
}

export default function QuestionCard({ question, onAnswer }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">{question.text}</h2>

      <div className="flex flex-col gap-3">
        {question.options.map(option => (
          <Button
            key={option.label}
            variant="outline"
            onClick={() => onAnswer(option.weight)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
