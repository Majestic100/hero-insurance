import { BadgeCheckIcon, ShieldCheckIcon, TimerIcon } from "lucide-react";

const USPS = [
  { icon: BadgeCheckIcon, text: "Gratis og uforpligtende" },
  { icon: TimerIcon, text: "Tager få minutter" },
  { icon: ShieldCheckIcon, text: "Du vælger selv" },
];

/** The short promises next to the main call to action. */
export function UspList() {
  return (
    <ul className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
      {USPS.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-2">
          <Icon aria-hidden className="size-4 shrink-0 text-brand" />
          {text}
        </li>
      ))}
    </ul>
  );
}
