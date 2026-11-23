import { describe, expect, it } from "vitest";

import { buildLeadEmail } from "./email";
import type { DeliveryPayload } from "./payload";

const payload: DeliveryPayload = {
  schema_version: 1,
  delivery_id: "1b49d448-97d9-442c-9038-98bb20455900",
  lead_id: "ec206f36-3db9-4abb-a163-0d4679db4856",
  submitted_at: "2026-11-02T15:27:14.123+00:00",
  contact: {
    first_name: "Søren",
    last_name: "<Hansen>",
    email: "soren@example.dk",
    phone: "12345678",
    street_address: "Vej 1",
    postal_code: "2100",
    city: "København Ø",
    birth_year: 1980,
    rki_status: "no",
    membership: null,
  },
  insurances: [{ type: "travel", answers: { tripType: "annual", area: "europe" }, form_version: "v1" }],
  consent: {
    text: "Jeg giver samtykke til ...",
    version: "2026-11-18.4",
    given_at: "2026-11-02T15:27:14.123+00:00",
  },
};

describe("buildLeadEmail", () => {
  const email = buildLeadEmail(payload);

  it("keeps personal data out of the subject", () => {
    expect(email.subject).toBe("Ny forespørgsel: Rejseforsikring (ref. 1b49d448)");
    expect(email.subject).not.toMatch(/Søren|12345678|example/);
  });

  it("has the contact details, readable answers and the consent", () => {
    expect(email.text).toContain("Navn: Søren <Hansen>");
    expect(email.text).toContain("Telefon: 12345678");
    expect(email.text).toContain("Adresse: Vej 1, 2100 København Ø");
    expect(email.text).toContain("Registreret i RKI: Nej");
    expect(email.text).toContain("Rejseforsikring");
    expect(email.text).not.toContain("annual");
    expect(email.text).toContain("version 2026-11-18.4");
    expect(email.text).toContain("Jeg giver samtykke til ...");
    expect(email.text).not.toContain("Medlemskab");
  });

  it("escapes user input in the HTML", () => {
    expect(email.html).toContain("Søren &lt;Hansen&gt;");
    expect(email.html).not.toContain("<Hansen>");
  });
});
