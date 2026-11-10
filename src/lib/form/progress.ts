/**
 * How full the progress bar is. It must never move backwards while the
 * user moves forward: picking insurance types on the first step adds
 * steps, so a plain current/total would shrink the bar on every tap.
 *
 * - First step: a small start, a bit more once a type is picked.
 * - Later steps: spread evenly from there to 90%. The bar only fills
 *   completely when the lead is sent (the thank-you page).
 */
export const PROGRESS_START = 5;
export const PROGRESS_STARTED = 15;
export const PROGRESS_LAST_STEP = 90;

export function progressPercent(
  index: number,
  total: number,
  hasSelection: boolean,
): number {
  if (index === 0) return hasSelection ? PROGRESS_STARTED : PROGRESS_START;
  if (total <= 1) return PROGRESS_LAST_STEP;
  const share = index / (total - 1);
  return PROGRESS_STARTED + (PROGRESS_LAST_STEP - PROGRESS_STARTED) * share;
}
