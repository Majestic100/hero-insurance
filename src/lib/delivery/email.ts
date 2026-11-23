import { INSURANCE_TYPE_INFO, isInsuranceType } from "@/config/forms/insurance-types";
import { MEMBERSHIP_OPTIONS } from "@/config/forms/steps/membership";
import { SITE } from "@/config/site";
import { buildAnswersSummary } from "@/lib/integrations/ghl/summary";
import type { DeliveryPayload } from "./payload";

/**
 * The e-mail a partner that receives leads by e-mail gets for one delivery:
 * the same data as the webhook payload (schema version 1), in readable
 * Danish. Pure, so it is unit tested. The subject holds no personal data,
 * only the insurance types and a short reference, because subjects often
 * show up in notifications and logs.
 */

const RKI_LABELS: Record<string, string> = { no: "Nej", yes: "Ja", unknown: "Ved ikke" };

export type LeadEmail = { subject: string; text: string; html: string };

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function typeLabel(type: string): string {
  return isInsuranceType(type) ? INSURANCE_TYPE_INFO[type].label : type;
}

export function buildLeadEmail(payload: DeliveryPayload): LeadEmail {
  const { contact } = payload;
  const types = payload.insurances.map((item) => typeLabel(item.type));
  const reference = payload.delivery_id.slice(0, 8);
  const subject = `Ny forespørgsel: ${types.join(", ")} (ref. ${reference})`;

  const membership = contact.membership
    ? (MEMBERSHIP_OPTIONS.find((option) => option.value === contact.membership)?.label ??
      contact.membership)
    : undefined;
  const address = [contact.street_address, [contact.postal_code, contact.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const contactLines: [string, string | undefined][] = [
    ["Navn", `${contact.first_name} ${contact.last_name}`],
    ["Telefon", contact.phone],
    ["E-mail", contact.email],
    ["Adresse", address || undefined],
    ["Fødselsår", contact.birth_year ? String(contact.birth_year) : undefined],
    ["Registreret i RKI", contact.rki_status ? (RKI_LABELS[contact.rki_status] ?? contact.rki_status) : undefined],
    ["Medlemskab", membership],
  ];
  const shownContact = contactLines.filter((line): line is [string, string] => Boolean(line[1]));
  const summary = buildAnswersSummary(
    payload.insurances.map((item) => ({ insurance_type: item.type, answers: item.answers })),
  );
  const submitted = new Date(payload.submitted_at).toLocaleString("da-DK", {
    timeZone: "Europe/Copenhagen",
    dateStyle: "long",
    timeStyle: "short",
  });

  const text = [
    `Ny forespørgsel fra ${SITE.name}, sendt ${submitted}.`,
    `Kunden vil have tilbud på: ${types.join(", ")}.`,
    "",
    "KONTAKTOPLYSNINGER",
    ...shownContact.map(([label, value]) => `${label}: ${value}`),
    "",
    "SVAR",
    summary,
    "",
    "SAMTYKKE",
    `Kunden har givet dette samtykke (version ${payload.consent.version}, ${payload.consent.given_at}):`,
    payload.consent.text,
    "",
    `Lead-id: ${payload.lead_id}`,
    `Leverings-id: ${payload.delivery_id}`,
    "Kontakt kunden hurtigst muligt. Oplysningerne må kun bruges til at give kunden et tilbud på de valgte forsikringer.",
  ].join("\n");

  const html = `<!doctype html><html lang="da"><body style="font-family:Arial,sans-serif;color:#0f2233;line-height:1.5">
<h2 style="color:#004a7c;margin:0 0 4px">Ny forespørgsel: ${escapeHtml(types.join(", "))}</h2>
<p style="margin:0 0 16px;color:#475a6b">Fra ${escapeHtml(SITE.name)}, sendt ${escapeHtml(submitted)}. Ref. ${escapeHtml(reference)}</p>
<h3 style="color:#004a7c">Kontaktoplysninger</h3>
<table cellpadding="4" style="border-collapse:collapse">${shownContact
    .map(
      ([label, value]) =>
        `<tr><td style="color:#475a6b;padding-right:16px">${escapeHtml(label)}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("")}</table>
<h3 style="color:#004a7c">Svar</h3>
<pre style="font-family:inherit;white-space:pre-wrap;margin:0">${escapeHtml(summary)}</pre>
<h3 style="color:#004a7c">Samtykke</h3>
<p style="color:#475a6b;margin:0 0 4px">Version ${escapeHtml(payload.consent.version)}, givet ${escapeHtml(payload.consent.given_at)}</p>
<p style="margin:0">${escapeHtml(payload.consent.text)}</p>
<p style="color:#475a6b;font-size:12px;margin-top:24px">Lead-id ${escapeHtml(payload.lead_id)} · Leverings-id ${escapeHtml(payload.delivery_id)}<br>Oplysningerne må kun bruges til at give kunden et tilbud på de valgte forsikringer.</p>
</body></html>`;

  return { subject, text, html };
}
