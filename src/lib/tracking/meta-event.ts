import { createHash } from "node:crypto";

/**
 * Builds a Meta Conversions API event. Pure (no network, no env), so it is
 * unit tested; sending happens in meta-capi.ts. Server only (node:crypto).
 *
 * Contact data is normalized and hashed with SHA-256 as Meta requires; it
 * never leaves the server in clear text. More match keys (name, postal
 * code, city, external id) help Meta tie the lead to the ad that drove it.
 * Form answers (the insurance details) are never sent.
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
 */

export type MetaLeadInput = {
  /** The lead's submission_id, also used by the browser Pixel event. */
  eventId: string;
  eventTime: Date;
  /** The page the lead was sent from. */
  sourceUrl: string;
  email: string;
  /** Danish number, 8 digits. */
  phone: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
  insuranceTypes: readonly string[];
  fbc?: string;
  fbp?: string;
  ipAddress?: string;
  userAgent?: string;
};

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Lowercase, without spaces and punctuation; Danish letters are kept. */
function compact(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Meta's normalization: lowercase trimmed e-mail, phone digits with country
 * code, names lowercase without punctuation, city and postal code lowercase
 * without spaces or punctuation.
 */
export function normalizeForMeta(input: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
}) {
  const digits = input.phone.replace(/\D/g, "");
  return {
    email: input.email.trim().toLowerCase(),
    phone: digits.length === 8 ? `45${digits}` : digits,
    firstName: compact(input.firstName),
    lastName: compact(input.lastName),
    postalCode: compact(input.postalCode),
    city: compact(input.city),
  };
}

export function buildMetaLeadEvent(input: MetaLeadInput) {
  const normalized = normalizeForMeta(input);
  return {
    event_name: "Lead",
    event_time: Math.floor(input.eventTime.getTime() / 1000),
    event_id: input.eventId,
    action_source: "website",
    event_source_url: input.sourceUrl,
    user_data: {
      em: [sha256(normalized.email)],
      ph: [sha256(normalized.phone)],
      fn: [sha256(normalized.firstName)],
      ln: [sha256(normalized.lastName)],
      zp: [sha256(normalized.postalCode)],
      ct: [sha256(normalized.city)],
      country: [sha256("dk")],
      // Our id for the lead, so later events (module 8) match the same person.
      external_id: [sha256(input.eventId)],
      ...(input.fbc && { fbc: input.fbc }),
      ...(input.fbp && { fbp: input.fbp }),
      ...(input.ipAddress && { client_ip_address: input.ipAddress }),
      ...(input.userAgent && { client_user_agent: input.userAgent }),
    },
    custom_data: {
      content_category: input.insuranceTypes.join(","),
    },
  };
}
