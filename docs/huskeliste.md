# Huskeliste

Alt, der skal besluttes, gennemgås eller vendes med andre, før siden går
live. Listen opdateres løbende, når nye spørgsmål dukker op.

Markering: **[Blokerer lancering]** skal være løst, før siden må tage imod
rigtige leads.

## Med partnerne

- [ ] **Spørgsmålene pr. forsikringstype.** Har partnerne det, de skal bruge
  til at give en pris? Mangler der noget, eller spørger vi om for meget?
  Kode: `src/config/forms/steps/` (én fil pr. type).
- [ ] **Intervaller og svarmuligheder**, fx kørsel om året, indboets værdi,
  bådens værdi og udbetaling på livsforsikring. Passer de med partnernes
  prisgrupper? Kode: samme filer.
- [ ] **Listen over forsikringsselskaber** i "Nuværende selskab". Findes
  Codan og Topdanmark stadig som selvstændige mærker? Mangler der nogen?
  Kode: `src/config/forms/insurers.ts`.
- [ ] **Fødselsår eller fødselsdato?** Vi spørger kun om fødselsår (mindst
  muligt data). Er det nok til prisen?
- [ ] **Nummerplade til MC, ATV og knallert** er valgfri. Skal den være
  påkrævet for nogle typer?
- [ ] **Levering af leads (modul 8):** hvilket format (API, e-mail, fil),
  hvilke felter, hvor hurtigt, og hvad sker der ved fejl?
- [ ] **Fordeling:** hvor mange partnere får hvert lead, og hvem får hvilke
  forsikringstyper? Det skal også stå i samtykketeksten.
- [ ] **Resultat pr. lead (feedback til Meta):** partnerne skal fortælle os,
  hvordan det gik med hvert lead (fx kontaktet, tilbud givet, solgt), så vi
  kan sende de gode leads tilbage til Meta og optimere annoncerne efter dem
  (modul 8). Hvilke statusser kan de levere, og hvordan (API, fil, e-mail)?

## Juridisk (advokat eller GDPR-rådgiver)

- [ ] **[Blokerer lancering] Samtykketeksten** til at sende oplysningerne
  videre til forsikringsselskaber. Den skal nævne modtagerne (navne eller
  en klar kategori) og formålet. Kode: `src/config/forms/consents.ts`.
- [ ] **[Blokerer lancering] Samtykke til markedsføring** (nyhedsbrev mv.)
  skal overholde markedsføringslovens § 10. Kode: samme fil.
- [ ] **[Blokerer lancering] Privatlivspolitik.** Siden
  `/privatlivspolitik` er en pladsholder. Kode:
  `src/app/privatlivspolitik/page.tsx`.
- [ ] **[Blokerer lancering] Kræver det registrering hos Finanstilsynet?**
  Formidling og sammenligning af forsikringer kan være
  forsikringsdistribution. Særligt Liv og Ulykke og sundhed.
- [ ] **Opbevaringstid:** hvor længe må vi gemme et lead, og hvornår slettes
  det automatisk?
- [ ] **Databehandleraftaler** med Supabase og Vercel, og aftaler med
  partnerne om, hvem der er dataansvarlig for hvad.
- [ ] **Bevis for samtykke:** vi gemmer tidspunkt, den præcise tekst og
  versionen. Er det nok, eller skal IP-adresse også gemmes?
- [ ] **[Blokerer lancering] Cookie-banner og tracking-samtykke:** teksten
  skal gennemgås, også fordi vi med samtykke sender hashede kontaktdata
  (e-mail, telefon, navn, postnummer og by) til Meta for at måle og optimere
  annoncer. Aldrig forsikringssvarene. Kode: `src/components/consent-banner.tsx`.

## Dig (forretning og indhold)

- [ ] **Brand:** navn, logo, farver og domæne. Siden er neutral indtil da.
- [ ] **Tekster** på forsiden og i formularen (overskrifter, hjælpetekster).
- [ ] **Afsender-e-mail** til kvitteringer, hvis vi skal sende dem.

## Konti og adgang

- [ ] **[Blokerer lancering] Opgrader Vercel til Pro** (ca. $20 om måneden).
  Hobby-planen må kun bruges ikke-kommercielt, og siden er kommerciel.
- [ ] **Slå "BotID Deep Analysis" til**, når Vercel er på Pro: Vercel >
  projektet > Firewall > Rules. Basisversionen af BotID kører allerede og
  stopper almindelige bots; Deep Analysis stopper også de avancerede
  ($1 pr. 1.000 tjek).
- [x] **Datafordeler (modul 6):** adgang og API-nøgler er på plads (én pr.
  miljø: Production, Preview og lokal). Postnummer udfylder nu byen.
- [ ] **Adresse- og BBR-opslag (modul 6):** næste skridt er at hente
  boligareal, byggeår og tagtype fra BBR ud fra adressen.
- [ ] **Nummerpladeopslag (modul 6):** valg af leverandør (betalt API).
- [x] **Meta (modul 7):** Pixel `2223771328169512` og Conversions API-token
  ligger i Vercel (Production og Preview). Preview sender kun test-events
  (`META_TEST_EVENT_CODE`). Lead fra serveren er bekræftet i Events Manager.
- [ ] **Hold øje med matchkvaliteten (EMQ)** for Lead i Events Manager, når
  der kommer rigtige leads. Den bør ligge højt (6 eller mere).
- [ ] **Andre tracking-værktøjer (modul 7):** skal vi bruge GA4 eller andet
  end Meta?

## Besluttet

Beslutninger, vi har truffet, så vi ikke diskuterer dem igen.

- 2026-11-02: Gode leads skal sendes tilbage til Meta, så annoncerne
  optimeres efter kvalitet (Pixel og Conversions API i modul 7, partnernes
  resultat pr. lead i modul 8).
- 2026-11-02: Venter med: intern oversigt over leads, automatisk sletning af
  gamle leads og e-mail til os ved nye leads.
- 2026-11-02: Spam-beskyttelse med Vercel BotID (usynlig, ingen ny
  leverandør eller nøgler). Turnstile er alternativet, hvis vi forlader
  Vercel. Ingen rate limiting pr. IP-adresse (det kræver, at vi gemmer
  IP-adresser).

- 2026-11-01: 12 forsikringstyper. Pension, lønsikring og A-kasse er fravalgt
  (kun forsikringer).
- 2026-11-01: Ingen helbreds- eller rygespørgsmål (følsomme oplysninger,
  GDPR art. 9). Partneren spørger selv.
- 2026-11-01: Navn, kontaktoplysninger, adresse og forsikringstagerens
  fødselsår spørges én gang i kontakttrinnet, ikke pr. forsikringstype.
- 2026-11-01: "Nuværende selskab" er valgfrit på alle typer undtagen
  Ejerskifte.
- 2026-11-01: Separat Supabase-projekt til udvikling og Preview, så
  test-leads aldrig lander i produktionen.
- 2026-11-01: Fundamentet bygges færdigt først (modul 4 og frem); design og
  tekster tages bagefter.
