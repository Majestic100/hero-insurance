import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type StepNavigationProps = {
  canGoBack: boolean;
  onBack: () => void;
  /** Hides the next button on the last step. */
  isLast: boolean;
};

/**
 * Back and next buttons. Sticky at the bottom on mobile so "Næste" is
 * always within thumb reach; inline from the `sm` breakpoint.
 */
export function StepNavigation({ canGoBack, onBack, isLast }: StepNavigationProps) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      {canGoBack && (
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 sm:flex-none"
          onClick={onBack}
        >
          <ChevronLeftIcon />
          Tilbage
        </Button>
      )}
      {!isLast && (
        <Button type="submit" className="h-11 flex-1 sm:ml-auto sm:flex-none">
          Næste
          <ChevronRightIcon />
        </Button>
      )}
    </div>
  );
}
