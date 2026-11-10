# Delivery (module 8)

Gets every lead to the partners reliably, and their outcomes back to Meta.

## How it works

1. **Routing at submit.** `routing.ts` picks the partners in
   `src/config/partners.ts` that cover the selected insurance types.
   `create_lead` saves the lead and one `lead_deliveries` row per partner in
   the same transaction, and only when the partner consent is granted. The
   recipients are fixed when the user consents.
2. **Sending.** Right after the response (`after()` in `/api/leads`),
   `deliver.ts` claims the lead's deliveries (`claim_lead_deliveries`,
   atomic with `skip locked`) and POSTs each one to the partner's webhook
   (`webhook.ts`), signed with `signature.ts`.
3. **Retries.** A failed attempt is retried by the cron job
   (`/api/cron/deliver-leads`, schedule in `vercel.json`) with growing delays
   (`retry.ts`: 1 min up to 24 h, 9 attempts, about two days). Then the
   status becomes `failed` and a person must look at it (see below).
4. **Outcomes.** Partners report on `POST /api/partners/outcomes`
   (`record-outcomes.ts`). Good outcomes are sent to Meta as custom events
   for the same lead (`outcome-meta.ts`), with tracking consent and within
   Meta's 7 days. Every outcome ends with a `meta_status` saying what
   happened.

Logs contain ids, partner ids and error codes only, never personal data.

## Adding a partner

1. The partner consent text (`src/config/forms/consents.ts`) names the
   partner or a clear category. Bump its version.
2. Add the partner to `PARTNERS` in `src/config/partners.ts`.
3. In Vercel, **Production only**: `PARTNER_<ID>_WEBHOOK_URL`,
   `PARTNER_<ID>_WEBHOOK_SECRET` (32+ random characters, e.g.
   `openssl rand -hex 32`) and `PARTNER_<ID>_API_KEY` (same). Give the
   partner the secret and the key over a safe channel.

A partner without env vars in an environment gets nothing there: its
deliveries wait (`last_error: not_configured`) and are retried.

## Failed deliveries

```sql
-- What is stuck or given up
select id, partner_id, status, attempts, last_error, created_at
from lead_deliveries where status in ('pending', 'failed') order by created_at;

-- Try a failed one again (the next cron run sends it)
update lead_deliveries set status = 'pending', next_attempt_at = now()
where id = '<id>';
```

## For partners: receiving leads (schema version 1)

We POST one JSON document per lead to your HTTPS endpoint:

```http
POST <your url>
Content-Type: application/json
X-Lead-Delivery-Id: 1b49d448-97d9-442c-9038-98bb20455900
X-Lead-Signature: t=1793633295,v1=5f0c...e9

{
  "schema_version": 1,
  "delivery_id": "1b49d448-97d9-442c-9038-98bb20455900",
  "lead_id": "ec206f36-3db9-4abb-a163-0d4679db4856",
  "submitted_at": "2026-11-02T15:27:14.123+00:00",
  "contact": {
    "first_name": "Test", "last_name": "Testesen",
    "email": "test@example.dk", "phone": "12345678",
    "street_address": "Testvej 1", "postal_code": "2100",
    "city": "København Ø", "birth_year": 1985,
    "rki_status": "no"
  },
  "insurances": [
    { "type": "travel", "form_version": "...",
      "answers": { "tripType": "annual", "area": "europe", "travellers": "me" } }
  ],
  "consent": { "text": "Jeg giver samtykke ...", "version": "2026-11-01.1",
               "given_at": "2026-11-02T15:27:14.123+00:00" }
}
```

- `contact.rki_status`: whether the user says they are registered in RKI:
  `no`, `yes` or `unknown` (`null` for leads from before 2026-11-10).
  Added without a new schema version: ignore fields you do not know.
- `contact.membership`: union or association for member discounts (codes
  in `src/config/forms/steps/membership.ts`), or `null`. A trade union is
  only sent when the user gave the separate membership consent.
- Vehicles looked up by license plate: `answers.registry.<field>.summary`
  has fixed fields (`make`, `model`, `variant`, `model_year`,
  `model_year_source` = `register` | `vin` | `first_registration`,
  `fuel_type`, `engine_power_kw`, `weight_kg`, `vin`, `first_registration`,
  `is_leasing`, `last_inspection`); `.vehicle` has everything the register
  has.
- `insurances` holds only the types you receive. The answers are codes; the
  list of fields and codes per type is in `src/config/forms/steps/`.
- **Check the signature:** HMAC-SHA256 of `<t>.<raw body>` with your
  webhook secret, hex, compared with `v1`. Reject `t` older than 5
  minutes. Reference: `verifyDeliverySignature` in `signature.ts`.
- **Answer 2xx** when you have stored the lead, within 10 seconds,
  optionally with `{ "reference": "<your id>" }`. Anything else is retried.
- **Ignore repeats:** the same lead can arrive more than once (retries).
  Use `X-Lead-Delivery-Id` (or `delivery_id`) to deduplicate.

## For partners: reporting outcomes

```http
POST /api/partners/outcomes
Authorization: Bearer <your API key>
Content-Type: application/json

{ "outcomes": [
  { "lead_id": "ec206f36-...", "status": "contacted" },
  { "lead_id": "ec206f36-...", "status": "quoted", "occurred_at": "2026-11-03T09:00:00+01:00" }
] }
```

- `status`: `contacted`, `quoted`, `sold`, `not_interested`, `unreachable`
  or `invalid`. `occurred_at` is optional (default: when we receive it).
- 1 to 100 outcomes per call. Report as soon as a status changes: early
  statuses (contacted, quoted) within a few days are what make our ads
  find better leads.
- The answer has one result per outcome: `accepted`, `duplicate` (already
  reported, safe to retry) or `unknown_lead` (not a lead we sent you).
- Errors: 401 wrong key, 422 invalid body (with `issues`), 500 try again.
