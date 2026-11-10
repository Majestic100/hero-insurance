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
- [ ] **Bildata til partnerne:** ved nummerplade gemmer vi nu alt, hvad
  Motorregistret har (mærke, model, variant, første indregistrering,
  brændstof, motor, vægt, stelnummer, leasing og seneste syn mv.). Årgang
  mangler ofte i registeret. Hvilke felter vil de have leveret (modul 8)?
- [ ] **Tagtyper:** listen er Tegl, Betontagsten (ny, fordi den er
  almindelig i BBR), Fibercement eller eternit, Strå, Tagpap og Andet.
  Passer det med partnernes prisgrupper, fx "hårdt" og "blødt" tag?
  Kode: `ROOF_TYPES` i `src/config/forms/steps/shared.ts`.
- [ ] **Bilforsikring (opdateret 2026-11-10 efter Findforsikring):** uden
  nummerplade spørger vi nu om mærke, model, drivmiddel, årgang og
  motorstørrelse; og under "Vis flere detaljer" om år med bil i eget navn
  og fri tekst. Vi spørger både om **skadefri år** og **år med bil i eget
  navn**. Bruger partnerne begge, eller kan vi droppe det ene?
- [ ] **Fri tekst til selskaberne** ("Andre oplysninger"): brugeren kan
  skrive hvad som helst, også ting vi ikke bør have (fx helbred). Vi
  advarer i hjælpeteksten. Er det nok, eller skal feltet væk? (også til
  advokaten)
- [ ] **Fødselsår eller fødselsdato?** Vi spørger kun om fødselsår (mindst
  muligt data). Er det nok til prisen?
- [ ] **Nummerplade til MC, ATV og knallert** er valgfri. Skal den være
  påkrævet for nogle typer?
- [ ] **Levering af leads (modul 8):** vi har bygget en standard, som vi
  kan tilbyde alle partnere: hvert lead sendes med det samme som signeret
  JSON til partnerens HTTPS-adresse, og ved fejl prøver vi igen i op til to
  døgn. Beskrivelsen til partnerne står i `src/lib/delivery/README.md`.
  Kan de tage imod det, eller kræver nogen e-mail eller fil? Svarene sendes
  som koder (fx `annual`, `europe`); vil de hellere have teksterne?
- [ ] **Fordeling:** hvor mange partnere får hvert lead, og hvem får hvilke
  forsikringstyper? Det skal også stå i samtykketeksten.
- [ ] **Resultat pr. lead (feedback til Meta):** partnerne skal fortælle os,
  hvordan det gik med hvert lead (fx kontaktet, tilbud givet, solgt), så vi
  kan sende de gode leads tilbage til Meta og optimere annoncerne efter dem
  (modul 8). Bygget som API: kontaktet, tilbud givet, solgt, ikke
  interesseret, kunne ikke træffes og ugyldigt. Kan de levere dem? **Vigtigt:**
  Meta bruger kun hændelser, der kommer inden for få dage efter klikket, så
  partnerne skal melde "kontaktet" og "tilbud givet" hurtigt (helst samme
  dag), ikke først når der er solgt.
- [ ] **Partnernes tekniske kontakt og nøgler:** for hver partner skal vi
  have en HTTPS-adresse til levering, og de skal have en hemmelig nøgle til
  signaturen og en API-nøgle til resultater (vi laver dem).

## Juridisk (advokat eller GDPR-rådgiver)

- [ ] **[Blokerer lancering] Gennemgå de juridiske sider (skrevet
  2026-11-10):** `/privatlivspolitik`, `/samtykke`, `/cookiepolitik`,
  `/betingelser`, `/om-os`, `/kontakt` og `/partnere` (kan ses på
  test.nemforsikringstilbud.dk). Skrevet ud fra, hvad siden faktisk gør i
  dag. Særlige spørgsmål til advokaten:
  - Privatlivspolitikken lover sletning af forespørgslen efter **12
    måneder** og af samtykkebevis (navn, e-mail, telefon og samtykker)
    efter **5 år**. Er det de rigtige frister? Sletningen er bygget og kører
    hver dag.
  - Er vi **fælles dataansvarlige med Meta** for Pixel og Conversions API
    (som skrevet), og dækker EU-US Data Privacy Framework overførslen til
    Vercel og Meta?
  - **Betingelserne** siger, at vi ikke sælger forsikringer og ikke
    rådgiver. Passer det med svaret om Finanstilsynet nedenfor?
- [ ] **[Blokerer lancering] Samtykketeksten** til at sende oplysningerne
  videre til forsikringsselskaber. Den skal nævne modtagerne (navne eller
  en klar kategori) og formålet. Vi har nu `/partnere`, der viser
  modtagerne automatisk fra listen i koden; teksten kunne henvise dertil.
  Kode: `src/config/forms/consents.ts` (`/samtykke` viser altid den
  aktuelle tekst).
- [ ] **[Blokerer lancering] Samtykke til markedsføring** (nyhedsbrev mv.)
  skal overholde markedsføringslovens § 10. Kode: samme fil.
- [ ] **[Blokerer lancering] Kræver det registrering hos Finanstilsynet?**
  Formidling og sammenligning af forsikringer kan være
  forsikringsdistribution. Særligt Liv og Ulykke og sundhed.
- [ ] **Opbevaringstid (bygget 2026-11-10):** hver dag slettes forespørgslen
  12 måneder efter (svar, adresse, fødselsår, RKI, Meta-id'er), og efter 5
  år slettes også navn, e-mail, telefon og samtykker. Bekræft fristerne med
  advokaten. Ændres de, er det én linje: `src/config/retention.ts`
  (privatlivspolitikken følger med automatisk).
- [ ] **Databehandleraftaler** med Supabase og Vercel, og aftaler med
  partnerne om, hvem der er dataansvarlig for hvad.
- [ ] **Bevis for samtykke:** vi gemmer tidspunkt, den præcise tekst og
  versionen. Er det nok, eller skal IP-adresse også gemmes?
- [ ] **[Blokerer lancering] Cookie-banner og tracking-samtykke:** teksten
  skal gennemgås, også fordi vi med samtykke sender hashede kontaktdata
  (e-mail, telefon, navn, postnummer og by) til Meta for at måle og optimere
  annoncer. Aldrig forsikringssvarene. Kode: `src/components/consent-banner.tsx`.

## Dig (forretning og indhold)

- [ ] **Brand:** navnet er Nemforsikringstilbud, og domænet
  nemforsikringstilbud.dk er købt. Farverne er valgt. Mangler: logo (du
  laver det; indtil da står navnet med et skjold-ikon), og at domænet
  kobles på Vercel (se "Konti og adgang").
- [ ] **[Blokerer lancering] Firmaoplysninger:** siderne skriver "Hero
  Media". E-handelsloven kræver det fulde firmanavn (fx "Hero Media ApS"),
  CVR-nummer og adresse. Kode: `COMPANY` i `src/config/site.ts`.
- [ ] **[Blokerer lancering] Opret e-mailen kontakt@nemforsikringstilbud.dk**
  hos Simply.com. Den står på alle de juridiske sider og på "Bliv partner",
  og folk skal kunne skrive for at få indsigt eller slette deres data.
- [ ] **[Blokerer lancering] Dokumentation for "Spar op til 3.300 kr. om
  året":** du har den og sender den, når den er klar. Teksten står
  allerede tydeligt øverst på forsiden og siderne pr. forsikringstype.
  Når dokumentationen kommer, tjekker vi, at ordlyden passer: er 3.300 kr.
  et gennemsnit ("i gennemsnit") eller det højeste ("op til")? Kode:
  `SAVINGS_CLAIM` i `src/config/site.ts`.
- [ ] **Forsiden og siderne pr. forsikringstype** (`/bilforsikring`,
  `/indboforsikring`, `/husforsikring`, `/ulykkesforsikring`): gennemgå
  overskrifter, tekster og spørgsmål og svar. Kode: `src/app/page.tsx` og
  `src/config/landing-pages.ts`. Ingen brugertal, Trustpilot eller
  kundeudtalelser, før vi har rigtige tal. Logoer fra partnerne kommer på,
  når partnerne er på plads.
- [ ] **Siderne pr. forsikringstype (alle 12, 2026-11-10):** de 8 nye
  (`/rejseforsikring`, `/fritidshusforsikring`, `/mc-forsikring`,
  `/baadforsikring`, `/campingforsikring`, `/dyreforsikring`,
  `/livsforsikring`, `/ejerskifteforsikring`) skal også gennemgås.
  Teksterne er generelle fakta om forsikringerne; tjek især dem om
  lovkrav (ansvar for hunde, knallerter og både, ejerskifte).
- [ ] **Trustpilot:** opret en profil. Undersøgelsen i modul 9 kan bede
  tilfredse brugere om en anmeldelse, så vi senere kan vise rigtige tal.
- [ ] **Bliv partner** (`/bliv-partner`): gennemgå teksten. Henvendelser går
  til kontakt-e-mailen.
- [ ] **Tekster** på forsiden og i formularen (overskrifter, hjælpetekster).
- [ ] **Afsender-e-mail** til kvitteringer, hvis vi skal sende dem.

## Konti og adgang

- [x] **Databaseændringen for automatisk sletning er kørt i produktion**
  (2026-11-10, efter test på dev). Sletningen kører hver dag.
- [x] **Databaseændringen for RKI er kørt** på dev og produktion
  (2026-11-10). RKI-svaret gemmes nu på leadet og sendes med til partnerne.
- [x] **Fast test-adresse:** `https://test.nemforsikringstilbud.dk` virker
  (2026-11-10) og viser altid det nyeste, vi arbejder på (branchen
  `preview`). Kræver login på Vercel. Til folk uden Vercel-konto (partnere,
  advokat): brug "Share" på en deployment i Vercel.
- [ ] **Kobl nemforsikringstilbud.dk på Production ved lanceringen** (ikke
  før samtykketekst, privatlivspolitik og første partner er på plads; DNS
  ligger hos Simply.com). Vercel > projektet >
  Settings > Domains > Add, tilføj både `nemforsikringstilbud.dk` og
  `www.nemforsikringstilbud.dk` (lad www viderestille til uden www, eller
  omvendt). Sæt derefter de DNS-poster, Vercel viser, hos den udbyder, hvor
  domænet er købt. Kobles kun på Production. Meta: tilføj og verificer
  domænet i Business Manager (Brand Safety > Domains), så Pixel-hændelser
  fra domænet tælles.

- [ ] **[Blokerer lancering] Opgrader Supabase-produktionsprojektet til Pro**
  (ca. $25 om måneden) for daglige backups, før de første rigtige leads.
  Så kan vi gendanne, hvis data bliver slettet ved en fejl (i koden, i
  dashboardet eller fra Claudes Supabase-forbindelse, som har fuld adgang).
  Pro bruges også senere til vores egen kopi af Motorregistret.
- [ ] **[Blokerer lancering] Opgrader Vercel til Pro** (ca. $20 om måneden).
  Hobby-planen må kun bruges ikke-kommercielt, og siden er kommerciel.
- [ ] **Slå "BotID Deep Analysis" til**, når Vercel er på Pro: Vercel >
  projektet > Firewall > Rules. Basisversionen af BotID kører allerede og
  stopper almindelige bots; Deep Analysis stopper også de avancerede
  ($1 pr. 1.000 tjek).
- [x] **Datafordeler (modul 6):** adgang og API-nøgler er på plads (én pr.
  miljø: Production, Preview og lokal). Postnummer udfylder nu byen.
- [x] **Adresse- og BBR-opslag (modul 6):** hus, indbo og fritidshus
  starter nu med boligens adresse. Vælges den på listen, udfyldes
  boligareal, byggeår og tagtype fra BBR, og adressen genbruges på
  "Dine oplysninger". Brugeren kan altid rette tallene.
- [ ] **Indbo i lejlighed:** BBR giver kun areal for huse, ikke for den
  enkelte lejlighed, så lejere udfylder selv arealet. Det kan hentes fra
  BBR's enheder, hvis brugeren også vælger etage og dør. Værd at bygge?
- [ ] **MotorAPI-nøgle (nummerplader, modul 6):** opret en konto på
  motorapi.dk (accepter deres handelsbetingelser og databehandleraftale),
  og læg nøglen i Vercel som `MOTORAPI_API_KEY` (Production og Preview) og
  i `.env.local`. Uden nøglen virker formularen som før, bare uden bildata.
  Gratis op til ca. 3.000 opslag om måneden.
- [ ] **Vores egen kopi af Motorregistret** i stedet for MotorAPI, så ingen
  udenfor ser, hvilke nummerplader vi slår op. Ugentligt job, der henter
  Motorstyrelsens statistikudtræk (100+ GB XML), og en tabel i Supabase.
  Kræver Supabase Pro (ca. $25 om måneden). Besluttet at vente
  (2026-11-02): MotorAPI først, "bare for at få det til at virke".
- [x] **Meta (modul 7):** Pixel `2223771328169512` og Conversions API-token
  ligger i Vercel (Production og Preview). Preview sender kun test-events
  (`META_TEST_EVENT_CODE`). Lead fra serveren er bekræftet i Events Manager.
- [ ] **Hold øje med matchkvaliteten (EMQ)** for Lead i Events Manager, når
  der kommer rigtige leads. Den bør ligge højt (6 eller mere).
- [x] **Databaseændringen for modul 8 er kørt i produktionen** (2026-11-03).
  Tabellerne til levering og resultater findes nu på både dev og produktion.
- [x] **`CRON_SECRET` i Vercel (Production)** er sat (2026-11-03) og
  testet: den daglige kørsel, der prøver fejlede leveringer igen, virker.
- [ ] **Hyppigere genforsøg efter Vercel Pro:** på Hobby må cron kun køre én
  gang i døgnet, så et lead, der fejler, kan vente op til et døgn. Med Pro
  ændres `vercel.json` til hvert 5. minut.
- [ ] **Besked ved fejlede leveringer:** i dag står de kun i Vercels log og i
  databasen (`lead_deliveries` med status `failed`). Før lancering bør vi få
  en advarsel, fx en alarm i Vercel eller en e-mail. Hvad foretrækker du?
- [ ] **Hvilken Meta-hændelse skal kampagnerne optimere efter?** Gode leads
  sendes som `LeadContacted`, `LeadQuoted` og `LeadSold`. I Events Manager
  laves en tilpasset konvertering på den, vi vælger (anbefaling:
  `LeadQuoted`, fordi den kommer hurtigt og siger noget om kvaliteten).
- [ ] **Andre tracking-værktøjer (modul 7):** skal vi bruge GA4 eller andet
  end Meta?

## Besluttet

Beslutninger, vi har truffet, så vi ikke diskuterer dem igen.

- 2026-11-10: Formularen: kontaktoplysninger og samtykke er ét trin
  ("Dine oplysninger"), fornavn og efternavn samt postnummer og by står
  ved siden af hinanden, og telefonnummeret har teksten "Deles kun med de
  selskaber, der skal give dig tilbud. Ingen spam." I formularen og på
  takkesiden er footeren lille (firma, privatlivspolitik, betingelser,
  cookies, åbner i ny fane), og "Få tilbud" er skjult i toppen. Takkesiden
  forklarer de næste skridt, beder brugeren tage telefonen (også fra
  ukendte numre) og tilbyder flere forsikringer.

- 2026-11-10: Claude har fuld adgang til begge Supabase-projekter via
  connectoren, så arbejdet ikke bremses. Sikkerheden er faste regler (i
  produktion kun læsning uden personoplysninger; ændringer kun via
  migrationer testet på dev og efter godkendelse) og daglige backups med
  Supabase Pro før lancering.
- 2026-11-10: Kontakttrinnet spørger "Er du registreret i RKI?" (Nej, Ja,
  Ved ikke), fordi partnerne bruger det. Gemmes på leadet (`rki_status`)
  og sendes med til partnerne. Gemmes aldrig i kladden i browseren.
- 2026-11-10: Spørgsmålene er sammenlignet med Findforsikring
  (`docs/research/findforsikring-forms.md`). Tilføjet: fri tekst på alle
  typer, hustype, fritidshustype, afbestilling (rejse), nummerplade og
  dækning (camping), motortype, byggeår, liggeplads, farvand og dækning
  (båd), branche (liv). Ikke kopieret: upload af tilstandsrapport, flere
  dyr eller personer i samme forespørgsel.

- 2026-11-10: Farver fra colorhunt.co/palette/00105b6061b6c9b5e0fcf9ec:
  navy #00105B (knapper og tekst), indigo #6061B6 (ikoner), blå #7692FF
  (flader og valgte felter, afløste lavendel #C9B5E0) og creme #FCF9EC.
  Baggrunden er hvid. Overskrifter på
  forsiden i Source Serif 4, al anden tekst og formularen i Geist.
- 2026-11-10: Siden hedder Nemforsikringstilbud (rettet fra
  Nemforsikringstjek, som stod her ved en fejl), på domænet
  nemforsikringstilbud.dk. "Hero Insurance" er kun det interne navn.
- 2026-11-02: Levering (modul 8): partnerne og deres forsikringstyper står
  i koden, og modtagerne af et lead lægges fast, når brugeren giver
  samtykke. Leads sendes kun, hvis samtykket til partnerne er givet. Ingen
  partnere er sat op endnu.

- 2026-11-02: Gode leads skal sendes tilbage til Meta, så annoncerne
  optimeres efter kvalitet (Pixel og Conversions API i modul 7, partnernes
  resultat pr. lead i modul 8).
- 2026-11-02: Venter med: intern oversigt over leads og e-mail til os ved
  nye leads. (Automatisk sletning blev bygget 2026-11-10, fordi
  privatlivspolitikken lover den.)
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
