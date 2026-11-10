-- Whether the user is registered in RKI (the Danish debtor register). The
-- partners always ask (owner, 2026-11-10). Answers: no, yes, unknown. Null
-- for leads from before this question.

alter table public.leads
  add column rki_status text check (rki_status in ('no', 'yes', 'unknown'));

comment on column public.leads.rki_status is
  'Registered in RKI: no, yes or unknown (asked on the contact step).';

-- Same function as before, now also saving rki_status.
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
    street_address, postal_code, city, birth_year, rki_status,
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
    payload->>'rki_status',
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
