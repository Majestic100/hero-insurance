-- Extends the allowed insurance types from 3 to 12.
-- Must match INSURANCE_TYPES in src/config/forms/insurance-types.ts.
-- The new list is a superset, so existing rows stay valid.

alter table public.lead_insurances
  drop constraint lead_insurances_insurance_type_check;

alter table public.lead_insurances
  add constraint lead_insurances_insurance_type_check check (
    insurance_type in (
      'car',
      'home_contents',
      'house',
      'accident_health',
      'travel',
      'holiday_home',
      'motorcycle_atv_moped',
      'boat',
      'caravan',
      'pet',
      'life',
      'change_of_ownership'
    )
  );
