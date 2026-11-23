import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * The Bliv Godt Forsikret mark: a house with an overhanging roof and a tick
 * in the middle (owner's choice, 2026-11-23). Roof and disc in the primary
 * deep blue, walls in the brand blue at 40 %, so the roof stands out as the
 * cover over you; the tick is cut out of the disc. Decorative next to the
 * name, so it is hidden from screen readers; the name carries the meaning.
 */
export function LogoMark({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <defs>
        <mask id={maskId}>
          <rect width="100" height="100" fill="#fff" />
          <path
            d="M41 64 L47.5 70.5 L59.5 58.5"
            fill="none"
            stroke="#000"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <path
        d="M7 49 L50 12 L93 49"
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      <path
        d="M21 46 V79 A7 7 0 0 0 28 86 H72 A7 7 0 0 0 79 79 V46"
        fill="none"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        className="stroke-brand"
      />
      <circle cx="50" cy="64" r="16" mask={`url(#${maskId})`} className="fill-primary" />
    </svg>
  );
}
