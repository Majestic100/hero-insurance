# Database

- `server.ts`: the server-only Supabase client (secret key), typed with
  `Database`.
- `types.ts`: generated database types. Do not edit by hand; regenerate with
  `npm run db:types` after every migration.

Queries go here as they are needed (lead insertion: module 5). Migrations
live in `/supabase/migrations`.

## Tables

| Table             | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `leads`           | One row per submission. Contact data in typed columns.         |
| `lead_insurances` | One row per selected insurance type, form answers as `jsonb`.  |
| `consents`        | Consent given or declined, with the exact text shown.          |

`lead_insurances` and `consents` are deleted with their lead
(`on delete cascade`), so erasing a lead removes all its data.
