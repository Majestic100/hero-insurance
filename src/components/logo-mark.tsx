import { cn } from "@/lib/utils";

/**
 * The Bliv Godt Forsikret mark: a plain half-circle umbrella with a lighter
 * handle (owner's choice, 2026-11-23). Canopy in the primary navy, handle in
 * the brand blue at half strength, so it works on white and on the light
 * blue surfaces. Decorative next to the name, so it is hidden from screen
 * readers; the name carries the meaning.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("size-7 shrink-0", className)}>
      <path d="M14 52 A36 36 0 0 1 86 52 Z" className="fill-primary" />
      <path
        d="M50 52 V75 A8 8 0 0 1 34 75"
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        className="stroke-brand"
        strokeOpacity="0.55"
      />
    </svg>
  );
}
