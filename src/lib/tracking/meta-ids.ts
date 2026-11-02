/**
 * Meta's click id (fbclid → `_fbc` cookie). Meta needs it to tie a lead to
 * the ad that was clicked. It is only stored with marketing consent, so on
 * the first page load it is kept in memory and written to the cookie when
 * (and if) the user consents. Client only.
 */

const FBC_COOKIE = "_fbc";
/** Meta's own lifetime for _fbc. */
const FBC_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

let clickId: string | undefined;
let clickTime: number | undefined;

/** Call once on page load: remembers ?fbclid=... in memory only. */
export function rememberClickId() {
  if (typeof window === "undefined" || clickId) {
    return;
  }
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (fbclid) {
    clickId = fbclid;
    clickTime = Date.now();
  }
}

/** With marketing consent: stores the click id in Meta's _fbc format. */
export function storeFbcFromClickId() {
  if (!clickId || document.cookie.includes(`${FBC_COOKIE}=`)) {
    return;
  }
  const value = `fb.1.${clickTime}.${clickId}`;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${FBC_COOKIE}=${value}; path=/; max-age=${FBC_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}
