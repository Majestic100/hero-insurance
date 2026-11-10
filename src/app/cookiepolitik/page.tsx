import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Cookiepolitik",
  description: "Hvilke cookies vi bruger, og hvordan du ændrer dit valg.",
};

type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

/** Keep in sync with src/lib/tracking (consent cookie, Meta ids). */
const NECESSARY: CookieRow[] = [
  {
    name: "hi_consent",
    provider: "Os",
    purpose: "Husker dit valg i cookiebanneret.",
    duration: "6 måneder",
  },
  {
    name: "Formularkladde (sessionStorage)",
    provider: "Os",
    purpose:
      "Gemmer dine svar i din browser, mens du udfylder formularen, så de ikke forsvinder ved en genindlæsning.",
    duration: "Til du lukker fanen",
  },
  {
    name: "Vercel BotID",
    provider: "Vercel",
    purpose: "Beskytter formularen mod automatiske forespørgsler fra robotter.",
    duration: "Under besøget",
  },
];

const MARKETING: CookieRow[] = [
  {
    name: "_fbp",
    provider: "Meta",
    purpose: "Genkender din browser, så vi kan måle, om vores annoncer virker.",
    duration: "90 dage",
  },
  {
    name: "_fbc",
    provider: "Meta",
    purpose: "Husker, at du kom fra en annonce på Facebook eller Instagram.",
    duration: "90 dage",
  },
];

/** One card per cookie: a table is too cramped at 375px. */
function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <dl className="space-y-3">
      {rows.map((row) => (
        <div key={row.name} className="rounded-lg border p-4 text-sm">
          <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-mono font-semibold">{row.name}</span>
            <span className="text-muted-foreground">
              {row.provider} · {row.duration}
            </span>
          </dt>
          <dd className="mt-2">{row.purpose}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CookiePolicyPage() {
  return (
    <ContentPage
      title="Cookiepolitik"
      updated="10. november 2026"
      intro={
        <p>
          Cookies er små filer, som hjemmesider gemmer i din browser. Vi
          bruger så få som muligt, og marketingcookies kun, hvis du siger ja.
        </p>
      }
    >
      <h2>Nødvendige</h2>
      <p>
        Får siden og formularen til at virke. De kræver ikke samtykke, og du
        kan ikke fravælge dem.
      </p>
      <CookieTable rows={NECESSARY} />

      <h2>Marketing</h2>
      <p>
        Bruges kun, hvis du trykker &quot;Accepter&quot;. Trykker du
        &quot;Afvis&quot;, indlæser vi slet ikke Metas kode. Metas egen kode
        kan også sætte cookies på Metas domæner, fx <code>fr</code>; læs mere
        i{" "}
        <a href="https://www.facebook.com/privacy/policies/cookies/" rel="noopener noreferrer">
          Metas cookiepolitik
        </a>
        .
      </p>
      <CookieTable rows={MARKETING} />

      <h2>Sådan ændrer du dit valg</h2>
      <p>
        Tryk på &quot;Cookieindstillinger&quot; nederst på siden. Du kan også
        slette cookies i din browser. Læs mere om, hvordan vi bruger
        oplysningerne, i vores{" "}
        <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>
    </ContentPage>
  );
}
