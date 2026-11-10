# GoHighLevel (module 9: follow-up)

GoHighLevel (GHL) runs the follow-up after a lead: a few days later it asks
the user by e-mail or SMS whether the insurers contacted them, whether they
got a quote and how satisfied they are; happy users are asked for a
Trustpilot review, and users nobody contacted become a call task.

Our side is two small pieces, both off until their env var is set:

- **Leads to GHL** (`sync.ts`): right after a lead is saved, and again from
  the daily cron for leads that did not make it (up to 7 days old), we POST
  the contact to the GHL **Inbound Webhook** of the follow-up workflow.
  Env: `GHL_INBOUND_WEBHOOK_URL`. Payload (`payload.ts`):

  ```json
  { "lead_id": "...", "submitted_at": "...", "first_name": "...",
    "last_name": "...", "email": "...", "phone": "+4512345678",
    "insurance_types": "Bil, Hus", "insurance_type_codes": "car,house",
    "marketing_consent": false, "source": "nemforsikringstilbud" }
  ```

  Never the form answers, the address, the birth year or RKI.
  `marketing_consent: true` is the only permission to send newsletters.

- **Answers back** (`/api/ghl/feedback`): the workflow posts the answers to
  `https://<domain>/api/ghl/feedback?key=<GHL_FEEDBACK_SECRET>` with a
  JSON body (top level or under `customData`):
  `lead_id` (from the contact), `contacted` and `quoted` ("Ja"/"Nej") and
  `satisfaction` (1-5). Saved in `lead_feedback` (latest answer wins).

## Setting it up in GHL (owner)

1. **Custom fields** on the contact: `lead_id` (text), `insurance_types`
   (text), `marketing_consent` (checkbox or text).
2. **Survey** in GHL (Sites > Surveys) with three questions: "Er du blevet
   kontaktet af et forsikringsselskab?" (Ja/Nej), "Har du fået et tilbud?"
   (Ja/Nej), "Hvor tilfreds er du?" (1-5), plus a hidden `lead_id` field
   filled from the contact.
3. **Workflow "Opfølgning"**:
   - Trigger: Inbound Webhook. Copy its URL into Vercel as
     `GHL_INBOUND_WEBHOOK_URL` (Production and Preview; Preview only if
     test contacts are fine in GHL).
   - Action: Create/Update Contact, mapping the fields above.
   - Wait 3 days, then send an e-mail (and/or SMS) with the survey link.
4. **Workflow "Opfølgning svar"**:
   - Trigger: Survey Submitted (the survey above).
   - Action: Webhook (POST) to `/api/ghl/feedback?key=...` with custom data
     `lead_id`, `contacted`, `quoted`, `satisfaction`. Generate a secret of
     at least 32 characters for `GHL_FEEDBACK_SECRET` in Vercel.
   - If satisfaction is 4 or 5: send the Trustpilot invitation.
   - If contacted is "Nej": create a task "Ring til kunden".
5. Only contacts with `marketing_consent` true may get newsletters.
