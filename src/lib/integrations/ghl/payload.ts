import {
  INSURANCE_TYPE_INFO,
  isInsuranceType,
} from "@/config/forms/insurance-types";

/**
 * What we send to GoHighLevel for one lead, and how we read the survey
 * answers it sends back. Pure, so it is unit tested.
 *
 * Only what the follow-up needs: name, e-mail, phone, the insurance types
 * and our lead id (GHL sends it back with the answers). Never the form
 * answers, the address, the birth year or RKI.
 */

export type GhlLeadInput = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  /** Normalized to 8 Danish digits by the form schema. */
  phone: string;
  insurance_types: string[];
  marketing_consent: boolean;
};

export type GhlContactPayload = {
  lead_id: string;
  submitted_at: string;
  first_name: string;
  last_name: string;
  email: string;
  /** E.164, as GHL expects for SMS. */
  phone: string;
  /** Danish names, e.g. "Bil, Hus", for e-mails and SMS. */
  insurance_types: string;
  /** Codes, e.g. "car,house", for workflow conditions. */
  insurance_type_codes: string;
  /** Only "true" may receive newsletters (markedsføringsloven § 10). */
  marketing_consent: boolean;
  source: "nemforsikringstilbud";
};

export function buildGhlContactPayload(lead: GhlLeadInput): GhlContactPayload {
  const types = lead.insurance_types.filter(isInsuranceType);
  const digits = lead.phone.replace(/\D/g, "");
  return {
    lead_id: lead.id,
    submitted_at: lead.created_at,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: digits.length === 8 ? `+45${digits}` : `+${digits}`,
    insurance_types: types.map((type) => INSURANCE_TYPE_INFO[type].shortLabel).join(", "),
    insurance_type_codes: types.join(","),
    marketing_consent: lead.marketing_consent,
    source: "nemforsikringstilbud",
  };
}

export type GhlFeedback = {
  leadId: string;
  contacted: boolean | null;
  quoted: boolean | null;
  satisfaction: number | null;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** "Ja", "yes", "true", true -> true; "Nej", "no", "false", false -> false. */
function toBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return null;
  const text = value.trim().toLowerCase();
  if (["ja", "yes", "true", "1"].includes(text)) return true;
  if (["nej", "no", "false", "0"].includes(text)) return false;
  return null;
}

/** 1-5 from a number or a text such as "4" or "4 - Tilfreds". */
function toSatisfaction(value: unknown): number | null {
  const match = String(value ?? "").match(/[1-5]/);
  return match ? Number(match[0]) : null;
}

/**
 * Reads the answers from a GHL workflow webhook. GHL puts custom values
 * either at the top level or under `customData`, so both are accepted.
 * Returns null without a valid lead id or without any answer.
 */
export function parseGhlFeedback(body: unknown): GhlFeedback | null {
  if (!body || typeof body !== "object") return null;
  const top = body as Record<string, unknown>;
  const custom =
    top.customData && typeof top.customData === "object"
      ? (top.customData as Record<string, unknown>)
      : {};
  const read = (key: string) => custom[key] ?? top[key];

  const leadId = String(read("lead_id") ?? "").trim();
  if (!UUID.test(leadId)) return null;

  const feedback = {
    leadId: leadId.toLowerCase(),
    contacted: toBoolean(read("contacted")),
    quoted: toBoolean(read("quoted")),
    satisfaction: toSatisfaction(read("satisfaction")),
  };
  const hasAnswer =
    feedback.contacted !== null || feedback.quoted !== null || feedback.satisfaction !== null;
  return hasAnswer ? feedback : null;
}
