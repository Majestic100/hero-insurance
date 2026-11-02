"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useConsent } from "./consent-context";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: Fbq;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/** Meta's loader, written out: a queue until fbevents.js has loaded. */
function loadPixel(pixelId: string) {
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
}

/**
 * The Meta Pixel. Loaded only when a pixel id is configured
 * (NEXT_PUBLIC_META_PIXEL_ID) and the user has given marketing consent.
 * Sends a PageView on every page. Renders nothing.
 */
export function MetaPixel() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const enabled = Boolean(pixelId && consent?.marketing);

  useEffect(() => {
    if (enabled && pixelId) {
      loadPixel(pixelId);
    } else if (window.fbq && consent && !consent.marketing) {
      // Consent withdrawn after the pixel was loaded.
      window.fbq("consent", "revoke");
    }
  }, [enabled, pixelId, consent]);

  useEffect(() => {
    if (enabled) {
      window.fbq?.("track", "PageView");
    }
  }, [enabled, pathname]);

  return null;
}
