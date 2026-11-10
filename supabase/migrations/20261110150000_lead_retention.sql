-- Automatic deletion of old leads, as promised in the privacy policy
-- (src/app/privatlivspolitik/page.tsx, retention in src/config/retention.ts):
--
-- 1. After `answers_after` (12 months): the request itself is deleted. The
--    answers per insurance, deliveries and partner outcomes are deleted,
--    and the address, birth year, RKI status and Meta ids are cleared.
--    Only name, e-mail and phone stay, with the consents, as proof of who
--    consented to what.
-- 2. After `delete_after` (5 years): the lead is deleted (consents cascade).
--
-- Called once a day by the cron job (/api/cron/deliver-leads) with the
-- service role. Safe to run more than once.

alter table public.leads
  add column if not exists answers_purged_at timestamptz;

comment on column public.leads.answers_purged_at is
  'When the answers and other request data were deleted (retention step 1).';

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

comment on function public.purge_old_leads(interval, interval) is
  'Retention: clears request data after answers_after, deletes leads after delete_after.';

revoke all on function public.purge_old_leads(interval, interval) from public, anon, authenticated;
grant execute on function public.purge_old_leads(interval, interval) to service_role;
