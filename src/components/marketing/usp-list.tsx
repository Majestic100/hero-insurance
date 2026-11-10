import { BadgeCheckIcon, PiggyBankIcon, ShieldCheckIcon, TimerIcon } from "lucide-react";

import { SAVINGS_CLAIM } from "@/config/site";

const USPS = [
  { icon: PiggyBankIcon, text: SAVINGS_CLAIM },
  { icon: BadgeCheckIcon, text: "Gratis og uforpligtende" },
  { icon: TimerIcon, text: "Tager få minutter" },
  { icon: ShieldCheckIcon, text: "Du vælger selv" },
];

/** The short promises next to the main call to action. */
export function UspList() {
  return (
    <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:gap-x-6">
      {USPS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 shrink-0 text-brand" />
          {text}
        </li>
      ))}
    </ul>
  );
}
