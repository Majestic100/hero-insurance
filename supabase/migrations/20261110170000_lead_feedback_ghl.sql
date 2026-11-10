-- Module 9: follow-up survey through GoHighLevel (GHL).
--
-- New leads are sent to GHL (contact details and insurance types only);
-- GHL runs the follow-up (e-mail/SMS survey, Trustpilot for happy users,
-- call tasks) and posts the answers back to /api/ghl/feedback.
--
-- leads.ghl_synced_at: when the lead reached GHL (the cron retries leads
-- that did not). lead_feedback: the user's own answers, one row per lead
-- (the latest answer wins). Safe to run more than once.

alter table public.leads
  add column if not exists ghl_synced_at timestamptz;

comment on column public.leads.ghl_synced_at is
  'When the lead was sent to GoHighLevel for the follow-up survey.';

create table if not exists public.lead_feedback (
  lead_id uuid primary key references public.leads (id) on delete cascade,
  received_at timestamptz not null default now(),
  contacted boolean,
  quoted boolean,
  satisfaction smallint check (satisfaction between 1 and 5),
  source text not null default 'ghl' check (source in ('ghl'))
);

comment on table public.lead_feedback is
  'The user''s answers to the follow-up survey (module 9).';

alter table public.lead_feedback enable row level security;
revoke all on table public.lead_feedback from anon, authenticated;
grant select, insert, update, delete on table public.lead_feedback to service_role;

-- Retention: the survey answers are part of the request, so step 1 deletes
-- them too. Same function as 20261110150000_lead_retention.sql otherwise.
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
