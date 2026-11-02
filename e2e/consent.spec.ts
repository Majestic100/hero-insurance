import { expect, test } from "@playwright/test";

/** The cookie banner: shown until a choice, both choices stored, reopenable. */

const banner = (page: import("@playwright/test").Page) =>
  page.getByRole("region", { name: "Cookies" });

async function consentCookie(context: import("@playwright/test").BrowserContext) {
  const cookies = await context.cookies();
  return cookies.find((cookie) => cookie.name === "hi_consent")?.value;
}

test("the banner asks once, and Afvis is stored", async ({ page, context }) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  await expect(banner(page).getByRole("button", { name: "Afvis" })).toBeVisible();
  await expect(banner(page).getByRole("button", { name: "Accepter" })).toBeVisible();

  await banner(page).getByRole("button", { name: "Afvis" }).click();
  await expect(banner(page)).toBeHidden();
  expect(await consentCookie(context)).toBe("v1.marketing-0");

  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(banner(page)).toBeHidden();
});

test("Accepter is stored, and the footer link reopens the banner", async ({
  page,
  context,
}) => {
  await page.goto("/?fbclid=test-click-id");
  await banner(page).getByRole("button", { name: "Accepter" }).click();
  expect(await consentCookie(context)).toBe("v1.marketing-1");

  // With consent, the Meta click id from the landing URL is kept as _fbc.
  const fbc = (await context.cookies()).find((cookie) => cookie.name === "_fbc");
  expect(fbc?.value).toMatch(/^fb\.1\.\d+\.test-click-id$/);

  await page.getByRole("button", { name: "Cookieindstillinger" }).click();
  await expect(banner(page)).toBeVisible();
  await banner(page).getByRole("button", { name: "Afvis" }).click();
  expect(await consentCookie(context)).toBe("v1.marketing-0");
});

test("without consent no Meta cookie is set", async ({ page, context }) => {
  await page.goto("/?fbclid=test-click-id");
  await banner(page).getByRole("button", { name: "Afvis" }).click();
  const names = (await context.cookies()).map((cookie) => cookie.name);
  expect(names).not.toContain("_fbc");
  expect(names).not.toContain("_fbp");
});
