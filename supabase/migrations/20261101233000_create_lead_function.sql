-- Module 5: saves a lead, its insurances and its consents in one
-- transaction. Called by the server (POST /api/leads) with the secret key
-- after the payload has been validated with the generated zod schema.
--
-- Idempotent: the client sends the same submission_id when it retries, so
-- a double click or a network retry returns the existing lead instead of
-- creating a second one.
--
-- payload:
-- {
--   "submission_id": uuid,
--   "first_name", "last_name", "email", "phone",
--   "street_address", "postal_code", "city": text,
--   "birth_year": number,
--   "insurances": [{ "insurance_type", "answers", "form_version" }],
--   "consents": [{ "consent_type", "granted", "consent_text", "consent_version" }]
-- }

create function public.create_lead(payload jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  submission uuid := (payload->>'submission_id')::uuid;
  new_id uuid;
begin
  if coalesce(jsonb_array_length(payload->'insurances'), 0) = 0 then
    raise exception 'create_lead: at least one insurance is required';
  end if;

  insert into public.leads (
    submission_id, first_name, last_name, email, phone,
    street_address, postal_code, city, birth_year
  )
  values (
    submission,
    payload->>'first_name',
    payload->>'last_name',
    payload->>'email',
    payload->>'phone',
    payload->>'street_address',
    payload->>'postal_code',
    payload->>'city',
    (payload->>'birth_year')::smallint
  )
  on conflict (submission_id) do nothing
  returning id into new_id;

  if new_id is null then
    -- Already saved (retry): return the existing lead, insert nothing more.
    select id into new_id from public.leads where submission_id = submission;
    return new_id;
  end if;

  insert into public.lead_insurances (lead_id, insurance_type, answers, form_version)
  select new_id, item->>'insurance_type', item->'answers', item->>'form_version'
  from jsonb_array_elements(payload->'insurances') as item;

  insert into public.consents (
    lead_id, consent_type, granted, consent_text, consent_version
  )
  select
    new_id,
    item->>'consent_type',
    (item->>'granted')::boolean,
    item->>'consent_text',
    item->>'consent_version'
  from jsonb_array_elements(coalesce(payload->'consents', '[]'::jsonb)) as item;

  return new_id;
end;
$$;

comment on function public.create_lead(jsonb) is
  'Saves a validated lead with its insurances and consents in one transaction. Idempotent on submission_id.';

revoke all on function public.create_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_lead(jsonb) to service_role;
