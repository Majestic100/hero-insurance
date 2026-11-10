import { Progress } from "@/components/ui/progress";

type StepProgressProps = {
  /** 0-based index of the current step. */
  index: number;
  total: number;
  /** How full the bar is, 0-100 (see src/lib/form/progress.ts). */
  value: number;
};

export function StepProgress({ index, total, value }: StepProgressProps) {
  // On the first step the number of steps is not known yet: it grows with
  // every type the user picks, so "1 af 3" would turn into "1 af 5".
  const label = index === 0 ? "Trin 1" : `Trin ${index + 1} af ${total}`;
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Progress value={value} aria-label={label} />
    </div>
  );
}
