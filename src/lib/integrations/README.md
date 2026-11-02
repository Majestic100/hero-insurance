# Integrations

Server-only clients for external registers and APIs. Called from server
endpoints, never from the browser, so API keys stay on the server.

- `datafordeler/`: the GraphQL client for Datafordeler (DAR addresses,
  BBR buildings). One key, `DATAFORDELER_API_KEY`; without it the
  lookups are off and the form works as before.
- `address/`: postal code to city (`lookupCity`, cached for a day), served
  to the form by `GET /api/postnummer/[postnr]`. Address autocomplete later.
- `bbr/`: BBR (building data)
- `license-plate/`: license plate lookup

Every endpoint that calls an integration is protected by BotID (listed in
`src/instrumentation-client.ts`), so others cannot spend our quota. A
failed lookup must never block a lead: the user then types the value.

Filled in: module 6 (postal code to city).
