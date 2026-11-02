import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * The whole quote flow in a real browser. POST /api/leads is mocked, so
 * nothing is saved; the server side is covered by unit tests and was
 * verified against the dev database.
 */

const next = (page: Page) => page.getByRole("button", { name: "Næste" }).click();

// A choice in the cookie banner, so the banner does not cover the form.
test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([
    { name: "hi_consent", value: "v1.marketing-0", url: baseURL ?? "http://localhost:3100" },
  ]);
});

async function fillContact(page: Page) {
  await expect(page.getByRole("heading", { name: "Dine oplysninger" })).toBeVisible();
  await page.getByLabel("Fornavn", { exact: true }).fill("Test");
  await page.getByLabel("Efternavn", { exact: true }).fill("Testesen");
  await page.getByLabel("E-mail", { exact: true }).fill("Test@Example.dk");
  await page.getByLabel("Telefonnummer", { exact: true }).fill("+45 12 34 56 78");
  await page.getByLabel("Adresse", { exact: true }).fill("Testvej 1");
  await page.getByLabel("Postnummer", { exact: true }).fill("2100");
  await page.getByLabel("By", { exact: true }).fill("København Ø");
  await page.getByLabel("Dit fødselsår", { exact: true }).fill("1985");
  await next(page);
}

async function fillTravel(page: Page) {
  await expect(page.getByRole("heading", { name: "Rejseforsikring" })).toBeVisible();
  await page.getByRole("radio", { name: /^Helårsrejseforsikring/ }).click();
  await page.getByRole("radio", { name: "Europa" }).click();
  await page.getByRole("radio", { name: "Kun mig" }).click();
  await next(page);
}

/** Mocks POST /api/leads and returns the bodies it received. */
async function mockLeadsApi(
  page: Page,
  respond: (route: Route) => Promise<void> = (route) =>
    route.fulfill({ status: 201, json: { ok: true } }),
) {
  const bodies: unknown[] = [];
  await page.route("**/api/leads", async (route) => {
    bodies.push(route.request().postDataJSON());
    await respond(route);
  });
  return bodies;
}

test("a car lead from the homepage to the thank-you page", async ({ page }) => {
  const bodies = await mockLeadsApi(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Bil", exact: true }).click();
  await expect(page).toHaveURL(/\/tilbud\?trin=forsikringer/);
  await expect(page.getByRole("checkbox", { name: "Bil" })).toBeChecked();
  await next(page);

  // Required fields are enforced, in Danish.
  await expect(page.getByRole("heading", { name: "Bilforsikring" })).toBeVisible();
  await next(page);
  await expect(page.locator("form").getByRole("alert").first()).toHaveText("Vælg en mulighed.");

  await page.getByRole("radio", { name: "Ja" }).click();
  await page.getByLabel("Nummerplade", { exact: true }).fill("ab 12 345");
  await page.getByRole("radio", { name: "Mig" }).click();
  await page.getByRole("radio", { name: "Under 10.000 km" }).click();
  await page.getByRole("radio", { name: /^Ansvar og kasko/ }).click();
  await page.getByRole("radio", { name: "6 år eller mere" }).click();
  await next(page);

  await fillContact(page);

  await expect(page.getByRole("heading", { name: "Send din forespørgsel" })).toBeVisible();
  await expect(page.getByText("Bilforsikring")).toBeVisible();
  await page.getByRole("checkbox", { name: /blive kontaktet med tilbud/ }).click();
  await page.getByRole("button", { name: /Send forespørgsel/ }).click();

  await expect(page).toHaveURL(/\/tilbud\/tak$/);
  await expect(page.getByRole("heading", { name: "Tak for din forespørgsel" })).toBeVisible();

  expect(bodies).toHaveLength(1);
  expect(bodies[0]).toMatchObject({
    submissionId: expect.stringMatching(/^[0-9a-f-]{36}$/),
    values: {
      insuranceTypes: ["car"],
      car: { hasLicensePlate: "yes", licensePlate: "ab 12 345" },
      email: "Test@Example.dk",
      consentPartnerContact: true,
    },
  });
  // The draft is cleared after sending.
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
});

test("consent is required and server errors are shown", async ({ page }) => {
  await mockLeadsApi(page, (route) =>
    route.fulfill({
      status: 500,
      json: { error: "Vi kunne ikke sende din forespørgsel. Prøv igen om lidt." },
    }),
  );

  await page.goto("/tilbud?forsikring=rejse");
  await next(page);
  await fillTravel(page);
  await fillContact(page);

  const send = page.getByRole("button", { name: /Send forespørgsel/ });
  await send.click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Du skal give samtykke");

  await page.getByRole("checkbox", { name: /blive kontaktet med tilbud/ }).click();
  await send.click();
  await expect(page.locator("form").getByRole("alert")).toHaveText(
    "Vi kunne ikke sende din forespørgsel. Prøv igen om lidt.",
  );
  await expect(page).toHaveURL(/trin=afslut/);
});

test("browser back works, and a reload keeps answers but not contact data", async ({
  page,
}) => {
  await page.goto("/tilbud?forsikring=rejse");
  await next(page);
  await fillTravel(page);
  await expect(page).toHaveURL(/trin=kontakt/);
  await page.getByLabel("Fornavn", { exact: true }).fill("Test");

  await page.goBack();
  await expect(page.getByRole("heading", { name: "Rejseforsikring" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "Europa" })).toBeChecked();

  await page.goForward();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dine oplysninger" })).toBeVisible();
  await expect(page.getByLabel("Fornavn", { exact: true })).toHaveValue("");

  const draft = await page.evaluate(() =>
    sessionStorage.getItem("hero-insurance:form-draft"),
  );
  expect(draft).toContain("europe");
  expect(draft).not.toContain("Test");
});
