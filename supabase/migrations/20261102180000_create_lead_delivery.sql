-- Module 8: delivering leads to partners and their outcomes back.
--
-- lead_deliveries is an outbox: one row per lead and partner, created in
-- the same transaction as the lead, so a saved lead is always queued.
-- The app sends it right after the submit and a cron job retries.
--
-- lead_outcomes holds what the partners report back (contacted, quoted,
-- sold, ...). Good outcomes are sent to Meta for the same lead.

create table public.lead_deliveries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  -- Must match a partner id in src/config/partners.ts.
  partner_id text not null check (partner_id ~ '^[a-z][a-z0-9_]{1,49}$'),
  -- The insurance types this partner gets from the lead.
  insurance_types text[] not null check (cardinality(insurance_types) > 0),
  status text not null default 'pending' check (
    status in ('pending', 'sending', 'sent', 'failed')
  ),
  attempts smallint not null default 0 check (attempts >= 0),
  -- When the row may be claimed next: a retry time while pending, a lease
  -- while sending (an expired lease means the sender died, so retry).
  next_attempt_at timestamptz not null default now(),
  -- Status code or error name only, never personal data.
  last_error text check (char_length(last_error) <= 200),
  sent_at timestamptz,
  -- The partner's id for the lead, if their API returns one.
  partner_reference text check (char_length(partner_reference) <= 200),

  unique (lead_id, partner_id)
);

comment on table public.lead_deliveries is
  'Outbox: one row per lead and partner it is delivered to.';

create index lead_deliveries_due_idx on public.lead_deliveries (next_attempt_at)
  where status in ('pending', 'sending');

create trigger lead_deliveries_set_updated_at
  before update on public.lead_deliveries
  for each row execute function public.set_updated_at();


create table public.lead_outcomes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  partner_id text not null check (partner_id ~ '^[a-z][a-z0-9_]{1,49}$'),
  -- Must match OUTCOME_STATUSES in src/lib/delivery/outcomes.ts.
  status text not null check (
    status in ('contacted', 'quoted', 'sold', 'not_interested', 'unreachable', 'invalid')
  ),
  occurred_at timestamptz not null,
  -- Meta: 'pending' (to send), 'sent', or why it is not sent.
  meta_status text not null default 'pending' check (
    meta_status in ('pending', 'sent', 'not_sent', 'no_consent', 'too_old', 'error')
  ),
  meta_sent_at timestamptz,

  -- A partner reports each status once per lead; repeats are ignored.
  unique (lead_id, partner_id, status)
);

comment on table public.lead_outcomes is
  'What a partner reports about a lead it received, e.g. contacted or sold.';

create index lead_outcomes_meta_pending_idx on public.lead_outcomes (occurred_at)
  where meta_status = 'pending';


alter table public.lead_deliveries enable row level security;
alter table public.lead_outcomes enable row level security;

revoke all on table public.lead_deliveries, public.lead_outcomes
  from anon, authenticated;

grant select, insert, update, delete
  on table public.lead_deliveries, public.lead_outcomes
  to service_role;


-- create_lead now also queues the deliveries the app routed
-- (payload->'deliveries': [{partner_id, insurance_types}]). They are only
-- created when the partner consent is granted, whatever the payload says.
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

  insert into public.lead_deliveries (lead_id, partner_id, insurance_types)
  select
    new_id,
    item->>'partner_id',
    array(select jsonb_array_elements_text(item->'insurance_types'))
  from jsonb_array_elements(coalesce(payload->'deliveries', '[]'::jsonb)) as item
  where exists (
    select 1 from public.consents c
    where c.lead_id = new_id
      and c.consent_type = 'partner_contact'
      and c.granted
  );

  return new_id;
end;
$$;

revoke all on function public.create_lead(jsonb) from public, anon, authenticated;
grant execute on function public.create_lead(jsonb) to service_role;


-- Claims due deliveries for sending: pending ones whose retry time has
-- come, and sending ones whose lease expired. Concurrent callers never get
-- the same row (skip locked). Each claimed row gets a lease and one more
-- attempt. Optionally limited to one lead (the send right after submit).
create function public.claim_lead_deliveries(
  max_rows integer,
  lease_seconds integer,
  only_lead uuid default null
)
returns setof public.lead_deliveries
language plpgsql
set search_path = ''
as $$
begin
  return query
  update public.lead_deliveries d
  set status = 'sending',
      attempts = d.attempts + 1,
      next_attempt_at = now() + make_interval(secs => lease_seconds)
  where d.id in (
    select id from public.lead_deliveries
    where status in ('pending', 'sending')
      and next_attempt_at <= now()
      and (only_lead is null or lead_id = only_lead)
    order by next_attempt_at
    limit max_rows
    for update skip locked
  )
  returning d.*;
end;
$$;

revoke all on function public.claim_lead_deliveries(integer, integer, uuid)
  from public, anon, authenticated;
grant execute on function public.claim_lead_deliveries(integer, integer, uuid)
  to service_role;
