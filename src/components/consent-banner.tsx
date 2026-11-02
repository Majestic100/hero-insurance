"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useConsent } from "@/lib/tracking/consent-context";

/**
 * Cookie consent. Shown until the user chooses, and again from
 * "Cookieindstillinger" in the footer. "Accepter" and "Afvis" are equally
 * prominent, as the Danish DPA requires. Nothing is sent to Meta, and the
 * Meta script is not even loaded, before "Accepter".
 *
 * TODO(owner): legal review of the text (docs/huskeliste.md).
 */
export function ConsentBanner() {
  const { ready, consent, setConsent, settingsOpen } = useConsent();
  if (!ready || (consent && !settingsOpen)) {
    return null;
  }

  return (
    <section
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="text-sm leading-relaxed">
          Vi vil gerne bruge cookies til at måle og forbedre vores annoncer på
          Facebook og Instagram (Meta). Det kræver dit samtykke. Cookies, som
          siden skal bruge for at virke, bruges altid.{" "}
          <Link href="/privatlivspolitik" className="underline underline-offset-4">
            Læs mere
          </Link>
        </p>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-11"
            onClick={() => setConsent({ marketing: false })}
          >
            Afvis
          </Button>
          <Button
            variant="outline"
            className="h-11"
            onClick={() => setConsent({ marketing: true })}
          >
            Accepter
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Footer link that reopens the banner. */
export function ConsentSettingsButton() {
  const { openSettings } = useConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className="flex min-h-11 items-center underline-offset-4 hover:underline"
    >
      Cookieindstillinger
    </button>
  );
}
