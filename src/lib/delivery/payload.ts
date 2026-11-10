import type { Json } from "@/lib/db/types";

/**
 * The JSON a partner receives for one delivery (schema version 1). Pure, so
 * it is unit tested. Documented for partners in src/lib/delivery/README.md;
 * a breaking change needs a new schema_version.
 *
 * Only what the partner needs to give a quote: contact details, the
 * answers for the insurance types routed to this partner, and proof of the
 * consent to be contacted. Never our tracking data (Meta ids) or the
 * marketing consent, which is for us only.
 */

/** The lead as loaded from the database (leads + relations). */
export type StoredLead = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string | null;
  postal_code: string | null;
  city: string | null;
  birth_year: number | null;
  /** no, yes or unknown; null for leads from before the question. */
  rki_status: string | null;
  lead_insurances: { insurance_type: string; answers: Json; form_version: string }[];
  consents: {
    consent_type: string;
    granted: boolean;
    consent_text: string;
    consent_version: string;
    recorded_at: string;
  }[];
};

export type DeliveryPayload = {
  schema_version: 1;
  delivery_id: string;
  lead_id: string;
  submitted_at: string;
  contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street_address: string | null;
    postal_code: string | null;
    city: string | null;
    birth_year: number | null;
    /** Registered in RKI: "no", "yes", "unknown", or null (older leads). */
    rki_status: string | null;
  };
  insurances: { type: string; answers: Json; form_version: string }[];
  consent: { text: string; version: string; given_at: string };
};

export function buildDeliveryPayload(
  deliveryId: string,
  insuranceTypes: readonly string[],
  lead: StoredLead,
): DeliveryPayload {
  const consent = lead.consents.find(
    (item) => item.consent_type === "partner_contact" && item.granted,
  );
  if (!consent) {
    // create_lead never queues a delivery without it; refuse to send anyway.
    throw new Error("buildDeliveryPayload: lead has no partner consent");
  }
  return {
    schema_version: 1,
    delivery_id: deliveryId,
    lead_id: lead.id,
    submitted_at: lead.created_at,
    contact: {
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      street_address: lead.street_address,
      postal_code: lead.postal_code,
      city: lead.city,
      birth_year: lead.birth_year,
      rki_status: lead.rki_status,
    },
    insurances: insuranceTypes.flatMap((type) => {
      const item = lead.lead_insurances.find((row) => row.insurance_type === type);
      return item
        ? [{ type, answers: item.answers, form_version: item.form_version }]
        : [];
    }),
    consent: {
      text: consent.consent_text,
      version: consent.consent_version,
      given_at: consent.recorded_at,
    },
  };
}
