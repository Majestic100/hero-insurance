# Form configuration

Fields per insurance type (car, home contents, house) as data, not code.
The zod schemas in `src/lib/schemas` are generated from this configuration.

- `insurance-types.ts`: the insurance type ids (matching the database),
  Danish labels and URL slugs (`/tilbud?forsikring=bil`).
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
