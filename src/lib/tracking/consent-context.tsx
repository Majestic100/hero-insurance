"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  parseConsent,
  readCookie,
  serializeConsent,
  type TrackingConsent,
} from "./consent";
import { storeFbcFromClickId } from "./meta-ids";

type ConsentState = {
  /** false until the cookie has been read in the browser. */
  ready: boolean;
  /** undefined: the user has not chosen yet. */
  consent: TrackingConsent | undefined;
  setConsent: (consent: TrackingConsent) => void;
  /** Shows the banner again, from "Cookieindstillinger". */
  openSettings: () => void;
  settingsOpen: boolean;
};

const ConsentContext = createContext<ConsentState | undefined>(undefined);

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax${secure}`;
}

/** Provides the tracking consent to the whole app (see layout.tsx). */
export function ConsentProvider({ children }: { children: ReactNode }) {
  // The raw cookie value: read in the browser, empty on the server.
  const raw = useSyncExternalStore(
    subscribe,
    () => readCookie(document.cookie, CONSENT_COOKIE) ?? "",
    () => null,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const setConsent = useCallback((consent: TrackingConsent) => {
    writeCookie(CONSENT_COOKIE, serializeConsent(consent), CONSENT_MAX_AGE_SECONDS);
    if (consent.marketing) {
      storeFbcFromClickId();
    }
    setSettingsOpen(false);
    notify();
  }, []);

  const value = useMemo<ConsentState>(
    () => ({
      ready: raw !== null,
      consent: raw ? parseConsent(raw) : undefined,
      setConsent,
      openSettings: () => setSettingsOpen(true),
      settingsOpen,
    }),
    [raw, setConsent, settingsOpen],
  );

  return <ConsentContext value={value}>{children}</ConsentContext>;
}

export function useConsent(): ConsentState {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return context;
}
