/**
 * The tracking consent, stored in a first-party cookie so both the browser
 * (to load the Meta Pixel) and the server (to send Conversions API events)
 * can read it. Shared by client and server; no secrets here.
 *
 * Only one optional category for now: "marketing" (measuring and
 * optimizing ads on Meta). Necessary storage (the form draft, BotID) needs
 * no consent.
 */

export const CONSENT_COOKIE = "hi_consent";

/** Bump when the banner text or categories change: everyone is asked again. */
export const CONSENT_VERSION = "1";

/** About six months, then the user is asked again. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

export type TrackingConsent = { marketing: boolean };

export function serializeConsent(consent: TrackingConsent): string {
  return `v${CONSENT_VERSION}.marketing-${consent.marketing ? 1 : 0}`;
}

/** undefined when there is no (current) choice yet. */
export function parseConsent(
  value: string | undefined,
): TrackingConsent | undefined {
  const match = value?.match(/^v(\d+)\.marketing-([01])$/);
  if (!match || match[1] !== CONSENT_VERSION) {
    return undefined;
  }
  return { marketing: match[2] === "1" };
}

/** Reads one cookie from a Cookie header or document.cookie string. */
export function readCookie(
  cookieString: string | null | undefined,
  name: string,
): string | undefined {
  if (!cookieString) {
    return undefined;
  }
  for (const part of cookieString.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
}
