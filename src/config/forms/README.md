# Form configuration

The form as data, not code. The zod schemas in `src/lib/schemas` are
generated from this configuration, and the components in
`src/components/form` render it.

- `insurance-types.ts`: the insurance type ids (matching the database),
  Danish labels and URL slugs (`/tilbud?forsikring=bil`). Icons live in
  `src/components/insurance-icons.ts`.
- `types.ts`: the config types. Field types are a union (`FieldConfig`).
- `index.ts`: the form itself: its `version` and its steps.
- `steps/<type>.ts`: the questions for one insurance type.
  `steps/shared.ts` holds option lists used by several types.
- `insurers.ts`: the "Nuværende selskab" field and its list of insurers.

A step with `insuranceType` is only shown when that type is selected, and
its values are stored under `values[insuranceType]`. Step ids appear in the
URL (`?trin=<id>`), so they are Danish.

Bump `version` whenever fields change. It is stored with each lead and
discards drafts saved with an older config.

## Field types

| Type            | Value                   | Notes                                            |
| --------------- | ----------------------- | ------------------------------------------------ |
| `multi-choice`  | `string[]`              | cards; `minSelected`, `layout: "grid"`           |
| `single-choice` | `string`                | radio cards; `layout: "grid"` for short labels   |
| `select`        | `string`                | native dropdown, for long lists                  |
| `text`          | `string`                | `maxLength`, `pattern`, `normalize`              |
| `number`        | `number`                | whole numbers, `min`/`max`, `unit`               |
| `year`          | `number`                | `minYear`, `maxYearsAgo`                         |

Every field is required unless `optional: true`. Error messages are Danish
defaults and can be overridden per field.

`showIf: { field, equals }` shows a field only when an earlier choice field
in the same step has one of the given values. Hidden fields are not
validated and are dropped when the values are parsed. A test checks that
every `showIf` points to a real option.

Values of choice fields are stored in the answers: never rename one.

## Adding an insurance type

1. Add the id and its Danish info to `insurance-types.ts`.
2. Add an icon in `src/components/insurance-icons.ts`.
3. Add a migration that extends the `insurance_type` check constraint
   (see `20261101133323_add_insurance_types.sql`). A test fails if the
   constraint and the list in code differ.
4. Add its questions in `steps/<type>.ts` and register them in `index.ts`.
5. Bump the config `version`.

## Adding a field type

1. Add the type to the `FieldConfig` union in `types.ts`.
2. Add its schema and default value in `src/lib/schemas/build-schema.ts`
   (and a test).
3. Add a component in `src/components/form/fields/` and a case in
   `src/components/form/field-renderer.tsx`.

Every insurance type has its questions (module 3). `index.ts` maps each
type to its fields with a full `Record`, so a new type without questions
fails the typecheck. No health questions anywhere (GDPR art. 9), and no
contact or address fields here: those are collected once, in module 4.
