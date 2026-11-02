import { createHash } from "node:crypto";

/**
 * Builds a Meta Conversions API event. Pure (no network, no env), so it is
 * unit tested; sending happens in meta-capi.ts. Server only (node:crypto).
 *
 * Contact data is hashed with SHA-256 as Meta requires; it never leaves
 * the server in clear text.
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
  insuranceTypes: readonly string[];
  fbc?: string;
  fbp?: string;
  ipAddress?: string;
  userAgent?: string;
};

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta wants lowercase, trimmed e-mail and digits with country code. */
export function normalizeForMeta(email: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  return {
    email: email.trim().toLowerCase(),
    phone: digits.length === 8 ? `45${digits}` : digits,
  };
}

export function buildMetaLeadEvent(input: MetaLeadInput) {
  const { email, phone } = normalizeForMeta(input.email, input.phone);
  return {
    event_name: "Lead",
    event_time: Math.floor(input.eventTime.getTime() / 1000),
    event_id: input.eventId,
    action_source: "website",
    event_source_url: input.sourceUrl,
    user_data: {
      em: [sha256(email)],
      ph: [sha256(phone)],
      country: [sha256("dk")],
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
