"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LANDING_PAGE_LIST } from "@/config/landing-pages";
import { INSURANCE_TYPE_INFO } from "@/config/forms/insurance-types";
import { COMPANY, SITE } from "@/config/site";
import { ConsentSettingsButton } from "./consent-banner";

const linkClass =
  "flex min-h-11 items-center underline-offset-4 hover:text-foreground hover:underline sm:min-h-9";

const ABOUT_LINKS = [
  { href: "/om-os", label: "Om os" },
  { href: "/partnere", label: "Partnere" },
  { href: "/bliv-partner", label: "Bliv partner" },
  { href: "/kontakt", label: "Kontakt" },
];

const LEGAL_LINKS = [
  { href: "/privatlivspolitik", label: "Privatlivspolitik" },
  { href: "/samtykke", label: "Samtykke" },
  { href: "/cookiepolitik", label: "Cookiepolitik" },
  { href: "/betingelser", label: "Betingelser" },
];

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="font-semibold text-foreground">{title}</h2>
      <ul className="mt-2">{children}</ul>
    </nav>
  );
}

/** The form (and its thank-you page) gets a small footer without exits. */
function isFunnel(pathname: string): boolean {
  return pathname === "/tilbud" || pathname.startsWith("/tilbud/");
}

/**
 * In the form: only what must be there (company, privacy, terms, cookie
 * settings), opened in a new tab so the form is not lost. Everywhere else:
 * links to every page.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (isFunnel(pathname)) {
    return <FunnelFooter />;
  }
  return (
    <footer className="border-t bg-cream">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 text-sm text-muted-foreground">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 space-y-2 sm:col-span-1">
            <p className="font-heading text-lg font-semibold text-foreground">{SITE.name}</p>
            <p>Én formular. Tilbud fra forsikringsselskaberne. Gratis og uforpligtende.</p>
          </div>
          <FooterGroup title="Forsikringer">
            {LANDING_PAGE_LIST.map((page) => (
              <li key={page.path}>
                <Link href={page.path} className={linkClass}>
                  {INSURANCE_TYPE_INFO[page.insuranceType].shortLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/tilbud" className={linkClass}>
                Alle forsikringer
              </Link>
            </li>
          </FooterGroup>
          <FooterGroup title="Om os">
            {ABOUT_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterGroup>
          <FooterGroup title="Dine data">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsButton />
            </li>
          </FooterGroup>
        </div>
        <p className="mt-10 border-t pt-6">
          © {SITE.name} · Drevet af {COMPANY.name}
          {COMPANY.cvr && <> · CVR {COMPANY.cvr}</>}
          {COMPANY.address && <> · {COMPANY.address}</>} ·{" "}
          <a href={`mailto:${SITE.email}`} className="underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </p>
      </div>
    </footer>
  );
}

function FunnelFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-6 px-4 py-4 text-sm text-muted-foreground">
        <p className="w-full sm:w-auto">
          © {SITE.name} · Drevet af {COMPANY.name}
        </p>
        {[
          { href: "/privatlivspolitik", label: "Privatlivspolitik" },
          { href: "/betingelser", label: "Betingelser" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {link.label}
          </a>
        ))}
        <ConsentSettingsButton />
      </div>
    </footer>
  );
}
