import { Progress } from "@/components/ui/progress";
import { progressPercent } from "@/lib/form/progress";

type StepProgressProps = {
  /** 0-based index of the current step. */
  index: number;
  total: number;
  /** Whether any insurance type is picked (changes the number of steps). */
  hasSelection: boolean;
};

export function StepProgress({ index, total, hasSelection }: StepProgressProps) {
  // On the first step the number of steps is not known yet: it grows with
  // every type the user picks, so "1 af 3" would turn into "1 af 5".
  const label = index === 0 ? "Trin 1" : `Trin ${index + 1} af ${total}`;
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <Progress value={progressPercent(index, total, hasSelection)} aria-label={label} />
    </div>
  );
}
