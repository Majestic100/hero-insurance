# Tracking

Measuring the funnel and sending leads to Meta, only with the user's
consent. Everything is off until Meta is configured (see `.env.example`).

- `consent.ts`: the consent cookie (`hi_consent`), shared by browser and
  server. One optional category: marketing. Bump `CONSENT_VERSION` when the
  banner text changes.
- `consent-context.tsx`: the consent in React; the banner is
  `src/components/consent-banner.tsx`, reopened from the footer.
- `meta-ids.ts`: keeps `?fbclid=` in memory and stores it as `_fbc` only
  after consent.
- `meta-pixel.tsx`: loads the Meta Pixel only with consent and a pixel id;
  PageView on every page.
- `track.ts`: `QuoteStepViewed` per form step and `Lead` after a saved lead.
- `meta-event.ts` + `meta-capi.ts` (server): the same `Lead` event sent by
  the server (Conversions API) after the response, with hashed e-mail,
  phone, first and last name, postal code, city, country and an
  `external_id` (the hashed lead id), plus `_fbc`, `_fbp`, IP and user
  agent. Never the form answers.

**Deduplication:** the browser and the server send `Lead` with the same
`event_id`: the lead's `submission_id`.

**Stored per lead** (`leads`): `tracking_consent`, `fbc`, `fbp`. Module 8
uses them to send partner outcomes (good leads) back to Meta for the same
lead. See "Owner requirement: lead quality back to Meta" in CLAUDE.md.

**Testing with real keys:** set `META_TEST_EVENT_CODE` and watch Events
Manager > Test events, then remove it.
