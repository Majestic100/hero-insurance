# Migrations

SQL migrations for the Supabase database, applied in filename order with
the Supabase CLI.

There are two Supabase projects: **dev** (local development and Vercel
Preview) and **production**. A migration always goes to dev first.

```bash
npx supabase migration new <name>   # create a new, empty migration
npm run db:push                     # apply pending migrations to dev
npm run db:types                    # regenerate src/lib/db/types.ts from dev
npm run db:push:prod                # apply to production, once verified on dev
```

The CLI must be logged in once per machine (`npx supabase login`).

Rules:

- Never edit a migration that has been pushed. Add a new one.
- Push to production only after the change is verified on dev, and before
  (or together with) merging the code that depends on it.
- Every new table must enable RLS, add no policies for `anon` or
  `authenticated`, and `revoke all ... from anon, authenticated`, as in
  `20261031165735_create_lead_tables.sql`.
- Regenerate the types and commit them in the same PR as the migration.
