# Schemas

zod schemas generated from the form configuration. The same schema is used
by the client form (react-hook-form) and by the server endpoint that
receives the lead. Do not hand-write a second copy of a schema.

`build-schema.ts`:

- `buildStepSchema(step)`: validates one step (used before "Næste").
- `buildFormSchema(config, selectedTypes)`: validates the whole form; the
  server uses this in module 5.
- `buildDefaultValues(config)`: empty values for every field.
- `findFirstInvalidStep(steps, values)`: used to guard deep links.

Every field type needs a test in `build-schema.test.ts` (`npm run test`).
