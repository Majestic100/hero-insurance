# Form components

Generic form components that render fields from the form configuration
(`src/config/forms`). They must not contain insurance-specific fields.

- `form-wizard.tsx`: the multi-step engine. Keeps the current step in the
  URL (`?trin=<id>`) so the browser back button works, validates each step
  with its generated zod schema, saves a draft in sessionStorage, and sends
  users back to the first invalid step on deep links. Renders only in the
  browser (the draft is not visible to the server).
- `field-renderer.tsx`: maps a field type to its component.
- `fields/`: one component per field type, plus `field-parts.tsx`
  (label, legend, help text and error, wired up for screen readers).
- `step-progress.tsx`, `step-navigation.tsx`: progress bar and back/next
  buttons (sticky at the bottom on mobile).
- `use-autofill.ts`: fills fields with `autofill` in their config (the city
  from the postal code, BBR facts from the address, the contact address
  from the home address) via `src/lib/form/autofill.ts`, without ever
  overwriting what the user typed.
- `fields/address-input.tsx`: address with suggestions from DAR (a
  combobox). A picked address carries its DAR id; a typed one does not.

Filled in: module 2 (skeleton), module 3 (field types), module 4 (contact and consent).
