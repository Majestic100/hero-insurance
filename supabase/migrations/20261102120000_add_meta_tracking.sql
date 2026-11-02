-- Module 7: what is needed to send a lead back to Meta, now and later.
--
-- tracking_consent  marketing consent from the cookie banner at submit time
-- fbc, fbp          Meta's click id and browser id (_fbc, _fbp cookies);
--                   only stored with consent
--
-- The Meta event id is the lead's submission_id, so no extra column. Module
-- 8 uses these to report good leads (partner outcomes) to Meta for the
-- same lead.

alter table public.leads
  add column tracking_consent boolean not null default false,
  add column fbc text check (char_length(fbc) <= 500),
  add column fbp text check (char_length(fbp) <= 200);

-- Same function as before, now also saving the tracking fields.
create or replace function public.create_lead(payload jsonb)
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
    street_address, postal_code, city, birth_year,
    tracking_consent, fbc, fbp
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
    (payload->>'birth_year')::smallint,
    coalesce((payload->>'tracking_consent')::boolean, false),
    payload->>'fbc',
    payload->>'fbp'
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

-- Grants survive "create or replace", but state them again to be explicit.
revoke all on function public.create_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_lead(jsonb) to service_role;
