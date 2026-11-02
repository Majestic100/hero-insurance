# Integrations

Server-only clients for external registers and APIs. Called from server
endpoints, never from the browser, so API keys stay on the server.

- `datafordeler/`: the GraphQL client for Datafordeler (DAR addresses,
  BBR buildings). One key, `DATAFORDELER_API_KEY`; without it the
  lookups are off and the form works as before.
- `address/`: postal code to city (`lookupCity`, `GET /api/postnummer/[postnr]`)
  and address search (`searchAddresses`, `GET /api/adresser?q=`). DAR's
  search is case sensitive and prefix only, so we query a few spellings
  at once.
- `bbr/`: build year, living area and roof of the home on an address
  (`lookupBuilding`, `GET /api/bbr/[id]`, id = DAR husnummer). Only single
  homes (houses, holiday homes); apartment blocks give nothing, because
  the building's area is not the apartment's.
- `license-plate/`: vehicle data for a Danish plate via MotorAPI
  (`lookupVehicle`, `GET /api/nummerplade/[plate]`). The browser only gets
  a one-line description to catch typos; the full vehicle data is looked up
  again on the server when the lead is saved (`src/lib/leads/registry-data.ts`)
  and stored in the answers under `registry`. MotorAPI is a stopgap: the
  plan is our own copy of the motor register (DMR), so no third party sees
  which plates we look up.

Every endpoint that calls an integration is protected by BotID (listed in
`src/instrumentation-client.ts`), so others cannot spend our quota. A
failed lookup must never block a lead: the user then types the value.

Answers are cached in memory (`cache.ts`): addresses for an hour, postal
codes and BBR facts for a day.

Filled in: module 6 (postal code, address search, BBR, license plates).
