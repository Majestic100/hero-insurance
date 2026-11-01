import { Progress } from "@/components/ui/progress";

type StepProgressProps = {
  /** 1-based number of the current step. */
  current: number;
  total: number;
};

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Trin {current} af {total}
      </p>
      <Progress
        value={(current / total) * 100}
        aria-label={`Trin ${current} af ${total}`}
      />
    </div>
  );
}
