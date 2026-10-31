# Migrations

SQL migrations for the Supabase database, applied in filename order with
the Supabase CLI.

```bash
npx supabase migration new <name>   # create a new, empty migration
npm run db:push                     # apply pending migrations to the linked project
npm run db:types                    # regenerate src/lib/db/types.ts
```

The CLI must be logged in and linked once per machine (`npx supabase login`,
`npx supabase link --project-ref <ref>`).

Rules:

- Never edit a migration that has been pushed. Add a new one.
- Every new table must enable RLS, add no policies for `anon` or
  `authenticated`, and `revoke all ... from anon, authenticated`, as in
  `20261031165735_create_lead_tables.sql`.
- Regenerate the types and commit them in the same PR as the migration.
