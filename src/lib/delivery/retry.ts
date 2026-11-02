/**
 * When a failed delivery is tried again. Pure, so it is unit tested.
 *
 * Attempt 1 is the send right after the submit. After that the cron job
 * retries with growing delays, about two days in all, then gives up
 * (status `failed`, which needs a person to look at it).
 */
export const RETRY_DELAYS_SECONDS = [
  60,
  5 * 60,
  15 * 60,
  60 * 60,
  3 * 60 * 60,
  6 * 60 * 60,
  12 * 60 * 60,
  24 * 60 * 60,
] as const;

export const MAX_ATTEMPTS = RETRY_DELAYS_SECONDS.length + 1;

/**
 * @param attempts attempts made so far, including the one that just failed
 * @returns when to try again, or null when there are no attempts left
 */
export function nextRetryAt(attempts: number, now: Date): Date | null {
  const delay = RETRY_DELAYS_SECONDS[attempts - 1];
  return delay === undefined ? null : new Date(now.getTime() + delay * 1000);
}
