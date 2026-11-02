import type { InsuranceType } from "@/config/forms/insurance-types";
import type { ConsentField, FormConfig } from "@/config/forms/types";
import type { Json } from "@/lib/db/types";
import { getSelectedTypes, type FormValues } from "@/lib/form/step-sequence";

/**
 * Turns form values that have passed the generated schema into the payload
 * for the database function `create_lead`. Pure, so it is unit tested.
 */

/** Contact fields (form name) and their column in `leads`. */
const CONTACT_COLUMNS = {
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
  phone: "phone",
  streetAddress: "street_address",
  postalCode: "postal_code",
  city: "city",
  birthYear: "birth_year",
} as const;

export type LeadTracking = {
  /** Marketing consent from the cookie banner. */
  consent: boolean;
  /** Meta click id and browser id (_fbc, _fbp); ignored without consent. */
  fbc?: string;
  fbp?: string;
};

export type LeadPayload = {
  submission_id: string;
  tracking_consent: boolean;
  fbc: string | null;
  fbp: string | null;
  insurances: {
    insurance_type: InsuranceType;
    answers: Json;
    form_version: string;
  }[];
  consents: {
    consent_type: ConsentField["consentType"];
    granted: boolean;
    consent_text: string;
    consent_version: string;
  }[];
} & Partial<
  Record<(typeof CONTACT_COLUMNS)[keyof typeof CONTACT_COLUMNS], Json>
>;

/** All consent fields in the config. */
function consentFields(config: FormConfig): ConsentField[] {
  return config.steps.flatMap((step) =>
    step.fields.filter((field): field is ConsentField => field.type === "consent"),
  );
}

/**
 * @param parsed values returned by the generated form schema (hidden
 *   fields already dropped, text already normalized)
 */
export function toLeadPayload(
  config: FormConfig,
  parsed: FormValues,
  submissionId: string,
  tracking: LeadTracking = { consent: false },
): LeadPayload {
  const payload: LeadPayload = {
    submission_id: submissionId,
    tracking_consent: tracking.consent,
    // Meta ids are personal data for ads: only kept with consent.
    fbc: tracking.consent ? (tracking.fbc ?? null) : null,
    fbp: tracking.consent ? (tracking.fbp ?? null) : null,
    insurances: [],
    consents: [],
  };

  for (const [field, column] of Object.entries(CONTACT_COLUMNS)) {
    payload[column] = parsed[field] as Json;
  }

  payload.insurances = getSelectedTypes(parsed).map((type) => ({
    insurance_type: type,
    answers: (parsed[type] ?? {}) as Json,
    form_version: config.version,
  }));

  // The consent text comes from the server's config, never from the
  // client, so the stored proof is exactly what the form showed.
  payload.consents = consentFields(config).map((field) => ({
    consent_type: field.consentType,
    granted: parsed[field.name] === true,
    consent_text: field.text,
    consent_version: field.version,
  }));

  return payload;
}
