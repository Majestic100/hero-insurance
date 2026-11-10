/**
 * Brand and company details, used in the header, footer, metadata and the
 * legal pages. The legal pages only show the fields that are set.
 */
export const SITE = {
  name: "Nemforsikringstilbud",
  domain: "nemforsikringstilbud.dk",
  /** General contact, also for data protection requests. */
  email: "kontakt@nemforsikringstilbud.dk",
} as const;

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
 * The savings claim shown on the homepage and landing pages. The owner has
 * documentation for it (2026-11-10). The wording must match what the
 * documentation shows (average or maximum, per year), see
 * docs/huskeliste.md.
 */
export const SAVINGS_CLAIM = "Spar op til 3.300 kr. om året";
