import { PiggyBankIcon } from "lucide-react";

import { SAVINGS_CLAIM } from "@/config/site";

/** The savings claim as a prominent line in the hero. */
export function SavingsHighlight() {
  return (
    <p className="flex items-center gap-3 text-xl font-semibold sm:text-2xl">
      <PiggyBankIcon aria-hidden className="size-7 shrink-0" />
      {SAVINGS_CLAIM}
    </p>
  );
}
