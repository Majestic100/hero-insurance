# Form configuration

Fields per insurance type (car, home contents, house) as data, not code.
The zod schemas in `src/lib/schemas` are generated from this configuration.

- `insurance-types.ts`: the insurance type ids (matching the database),
  Danish labels and URL slugs (`/tilbud?forsikring=bil`). Icons live in
  `src/components/insurance-icons.ts`.

## Adding an insurance type

1. Add the id and its Danish info to `insurance-types.ts`.
2. Add an icon in `src/components/insurance-icons.ts`.
3. Add a migration that extends the `insurance_type` check constraint
   (see `20261101133323_add_insurance_types.sql`). A test fails if the
   constraint and the list in code differ.
4. Bump the config `version`.
- `types.ts`: the config types. Field types are a union (`FieldConfig`).
- `index.ts`: the form itself: its `version` and its steps.

A step with `insuranceType` is only shown when that type is selected, and
its values are stored under `values[insuranceType]`. Step ids appear in the
URL (`?trin=<id>`), so they are Danish.

Bump `version` whenever fields change. It is stored with each lead and
discards drafts saved with an older config.

## Adding a field type

1. Add the type to the `FieldConfig` union in `types.ts`.
2. Add its schema and default value in `src/lib/schemas/build-schema.ts`
   (and a test).
3. Add a component in `src/components/form/fields/` and a case in
   `src/components/form/field-renderer.tsx`.

The insurance steps get their fields in module 3.
