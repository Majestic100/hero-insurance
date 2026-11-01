# Form components

Generic form components that render fields from the form configuration
(`src/config/forms`). They must not contain insurance-specific fields.

- `form-wizard.tsx`: the multi-step engine. Keeps the current step in the
  URL (`?trin=<id>`) so the browser back button works, validates each step
  with its generated zod schema, saves a draft in sessionStorage, and sends
  users back to the first invalid step on deep links. Renders only in the
  browser (the draft is not visible to the server).
- `field-renderer.tsx`: maps a field type to its component.
- `fields/`: one component per field type.
- `step-progress.tsx`, `step-navigation.tsx`: progress bar and back/next
  buttons (sticky at the bottom on mobile).

Filled in: module 2 (skeleton), module 3 (field types), module 4 (contact and consent).
