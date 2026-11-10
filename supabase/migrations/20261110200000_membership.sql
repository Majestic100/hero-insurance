-- Membership of a union or association, for insurers' member discounts
-- (owner, 2026-11-10; Findforsikring asks too). Trade union membership is
-- special category data (GDPR art. 9), so a union is only stored with the
-- user's explicit, separate consent (consent_type 'membership'); the form
-- enforces it and the server re-validates. Retention step 1 clears it.
-- Safe to run more than once.

alter table public.leads
  add column if not exists membership text check (char_length(membership) <= 50);

comment on column public.leads.membership is
  'Union or association for member discounts (code); unions only with consent_type membership.';

alter table public.consents drop constraint if exists consents_consent_type_check;
alter table public.consents add constraint consents_consent_type_check
  check (consent_type in ('partner_contact', 'marketing', 'membership'));

-- Same function as before, now also saving membership.
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
    street_address, postal_code, city, birth_year, rki_status, membership,
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
    payload->>'membership',
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

-- Same function as before, now also clearing membership in step 1.
create or replace function public.purge_old_leads(
  answers_after interval,
  delete_after interval
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  answers_cutoff timestamptz := now() - answers_after;
  delete_cutoff timestamptz := now() - delete_after;
  purged integer;
  deleted integer;
begin
  -- Guard against a wrong argument deleting fresh leads.
  if answers_after < interval '30 days' or delete_after < answers_after then
    raise exception 'purge_old_leads: retention too short (% / %)', answers_after, delete_after;
  end if;

  with old as (
    select id from public.leads
    where created_at < answers_cutoff and answers_purged_at is null
  ),
  insurances as (
    delete from public.lead_insurances where lead_id in (select id from old)
  ),
  deliveries as (
    delete from public.lead_deliveries where lead_id in (select id from old)
  ),
  outcomes as (
    delete from public.lead_outcomes where lead_id in (select id from old)
  ),
  feedback as (
    delete from public.lead_feedback where lead_id in (select id from old)
  ),
  cleared as (
    update public.leads set
      street_address = null,
      postal_code = null,
      city = null,
      address_id = null,
      birth_year = null,
      rki_status = null,
      membership = null,
      fbc = null,
      fbp = null,
      answers_purged_at = now()
    where id in (select id from old)
    returning 1
  )
  select count(*) into purged from cleared;

  with gone as (
    delete from public.leads where created_at < delete_cutoff returning 1
  )
  select count(*) into deleted from gone;

  return jsonb_build_object('answers_purged', purged, 'leads_deleted', deleted);
end;
$$;

revoke all on function public.purge_old_leads(interval, interval) from public, anon, authenticated;
grant execute on function public.purge_old_leads(interval, interval) to service_role;
