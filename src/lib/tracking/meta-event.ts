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

export type MetaUserInput = {
  /** The lead's submission_id; its hash is the `external_id`. */
  submissionId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
  fbc?: string | null;
  fbp?: string | null;
  ipAddress?: string;
  userAgent?: string;
};

/** The hashed match keys, the same for every event about one lead. */
export function buildMetaUserData(input: MetaUserInput) {
  const normalized = normalizeForMeta(input);
  return {
    em: [sha256(normalized.email)],
    ph: [sha256(normalized.phone)],
    fn: [sha256(normalized.firstName)],
    ln: [sha256(normalized.lastName)],
    zp: [sha256(normalized.postalCode)],
    ct: [sha256(normalized.city)],
    country: [sha256("dk")],
    // Our id for the lead, so later events (module 8) match the same person.
    external_id: [sha256(input.submissionId)],
    ...(input.fbc && { fbc: input.fbc }),
    ...(input.fbp && { fbp: input.fbp }),
    ...(input.ipAddress && { client_ip_address: input.ipAddress }),
    ...(input.userAgent && { client_user_agent: input.userAgent }),
  };
}

export function buildMetaLeadEvent(input: MetaLeadInput) {
  return {
    event_name: "Lead",
    event_time: Math.floor(input.eventTime.getTime() / 1000),
    event_id: input.eventId,
    action_source: "website",
    event_source_url: input.sourceUrl,
    user_data: buildMetaUserData({ ...input, submissionId: input.eventId }),
    custom_data: {
      content_category: input.insuranceTypes.join(","),
    },
  };
}

export type MetaOutcomeInput = MetaUserInput & {
  /** Custom event name, e.g. LeadQuoted. */
  eventName: string;
  /** The partner's status, e.g. quoted. */
  status: string;
  occurredAt: Date;
};

/**
 * A later stage of the same lead, reported by a partner (module 8). The
 * event id is the lead and the status, so the same stage reported twice
 * (or by two partners) is deduplicated by Meta. Sent from our system, not
 * from a browser, so there is no IP, user agent or page url.
 */
export function buildMetaOutcomeEvent(input: MetaOutcomeInput) {
  return {
    event_name: input.eventName,
    event_time: Math.floor(input.occurredAt.getTime() / 1000),
    event_id: `${input.submissionId}:${input.status}`,
    action_source: "system_generated",
    user_data: buildMetaUserData(input),
    custom_data: { lead_status: input.status },
  };
}
