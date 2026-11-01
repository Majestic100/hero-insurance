-- Module 4: the policyholder's birth year, asked once in the contact step.
-- Many prices depend on age; the year is the least data that answers it.
-- Nullable so existing rows stay valid; the form requires it.

alter table public.leads
  add column birth_year smallint check (birth_year between 1900 and 2100);
