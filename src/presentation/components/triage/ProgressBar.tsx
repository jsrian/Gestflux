interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="mb-4">
      <div className="h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-blue-600 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Pergunta {current + 1} de {total}
      </p>
    </div>
  );
}
