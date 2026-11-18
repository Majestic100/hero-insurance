/**
 * Brand and company details, used in the header, footer, metadata and the
 * legal pages. The legal pages only show the fields that are set.
 */
export const SITE = {
  name: "Bliv Godt Forsikret",
  domain: "blivgodtforsikret.dk",
  /**
   * General contact, also for data protection requests. If it changes,
   * also change it in the consent texts in src/config/forms/consents.ts
   * and bump their versions.
   */
  email: "kontakt@blivgodtforsikret.dk",
  /** Profiles elsewhere, linked in the footer and on the contact page. */
  profiles: [
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61596918560784" },
    { label: "Instagram", href: "https://www.instagram.com/blivgodtforsikret/" },
    { label: "Trustpilot", href: "https://dk.trustpilot.com/review/blivgodtforsikret.dk" },
  ],
} as const;

/** Canonical origin, used for metadata, the sitemap and robots.txt. */
export const SITE_URL = `https://${SITE.domain}`;

/**
 * Only Vercel Production may be indexed by search engines. Preview (the
 * test address) and local builds answer "noindex" and disallow crawling.
 */
export const IS_INDEXABLE = process.env.VERCEL_ENV === "production";

/**
 * The company behind the site (data controller). E-handelsloven § 7
 * requires name, address, e-mail and CVR to be easy to find.
 *
 * TODO(owner): legal name, CVR and address, see docs/huskeliste.md.
 */
export const COMPANY: {
  name: string;
  cvr?: string;
  address?: string;
} = {
  name: "Hero Media",
};

/**
 * The savings claim, shown prominently in the hero of the homepage and the
 * landing pages (owner, 2026-11-10). The owner has
 * documentation for it (2026-11-10). The wording must match what the
 * documentation shows (average or maximum, per year), see
 * docs/huskeliste.md.
 */
export const SAVINGS_CLAIM = "Spar op til 3.300 kr. om året";
