# Huskeliste

Alt, der skal besluttes, gennemgås eller vendes med andre, før siden går
live. Listen opdateres løbende, når nye spørgsmål dukker op.

Markering: **[Blokerer lancering]** skal være løst, før siden må tage imod
rigtige leads.

## Med partnerne

- [x] **Spørgsmålene pr. forsikringstype** (2026-11-10): vi spørger om det
  samme som Findforsikring eller mere, så partnerne har det, de plejer at
  få. De kan stadig bede om ændringer.
  Kode: `src/config/forms/steps/` (én fil pr. type).
- [x] **Intervaller og svarmuligheder** (løst 2026-11-10 uden at kende
  partnernes prisgrupper): fine intervaller kan altid lægges sammen til
  grove, men grove kan aldrig deles. Derfor: **beløb** hvor brugeren kender
  tallet (bådens og campingvognens værdi, livsforsikringssum, salgspris),
  og **finere intervaller** hvor brugeren gætter (kørsel om året i trin af
  5.000 km op til 30.000, så 30-40.000 og over 40.000; indboets værdi i
  trin op til over 1,5 mio. kr.). Bruger en partner andre grupper, kan vi
  oversætte ved levering. Kode: `src/config/forms/steps/`.
- [x] **Listen over forsikringsselskaber** i "Nuværende selskab": udvidet til
  46 selskaber efter Findforsikrings liste (2026-11-10). Codan og
  Topdanmark er bevaret, fordi mange stadig kender deres police under det
  navn. Kode: `src/config/forms/insurers.ts`.
- [x] **Bildata til partnerne** (løst 2026-11-10 som Findforsikring): ved
  nummerplade får partnerne faste felter (mærke, model, variant, årgang,
  drivmiddel, motor i kW, vægt, stelnummer, første indregistrering, leasing,
  seneste syn) og alt det øvrige fra Motorregistret. **Årgang** tages fra
  registeret, ellers fra stelnummeret (10. tegn, fx hos VW-koncernen),
  ellers fra første indregistrering; feltet `model_year_source` siger
  hvilken.
- [x] **Tagtyper** (besluttet 2026-11-10, som Findforsikring): Hårdt tag,
  Fladt tag, Stråtag, Andet og Ved ikke. BBR's tagmateriale oversættes
  automatisk (tegl, beton, eternit og metal er hårdt tag; tagpap er fladt
  tag; strå er stråtag). Kode: `ROOF_TYPES` i
  `src/config/forms/steps/shared.ts`.
- [x] **Skadefri år eller år med bil i eget navn** (besluttet 2026-11-10,
  som Findforsikring): kun år med bil i eget navn, valgfrit under "Vis
  flere detaljer". Skadefri år er fjernet fra bilforsikringen (MC beholder
  det).
- [x] **Fri tekst til selskaberne** (besluttet 2026-11-10): beholdes, som hos
  Findforsikring og Forsikringsportalen, med advarslen om helbred i
  hjælpeteksten.
- [x] **Medlemskab af fagforening eller forening** (bygget 2026-11-10, som
  Findforsikring): valgfrit spørgsmål på kontakttrinnet. Vælger brugeren en
  fagforening, kræves et særskilt, udtrykkeligt samtykke (GDPR art. 9), der
  gemmes som bevis; FDM, Ældresagen og andre foreninger kræver det ikke.
  Advokaten skal godkende samtykketeksten (`consentMembership` i
  `src/config/forms/consents.ts`).
- [x] **Fødselsår** (besluttet 2026-11-10): vi beholder fødselsåret.
  Findforsikring spørger kun om alder, så det er mindst lige så godt.
- [x] **Nummerplade til MC, ATV og knallert** (besluttet 2026-11-10, som
  Findforsikring): valgfri; brugeren kan fortsætte uden.
- [ ] **Levering af leads (modul 8):** vi har bygget en standard, som vi
  kan tilbyde alle partnere: hvert lead sendes med det samme som signeret
  JSON til partnerens HTTPS-adresse, og ved fejl prøver vi igen i op til to
  døgn. Beskrivelsen til partnerne står i `src/lib/delivery/README.md`.
  Kan de tage imod det, eller kræver nogen e-mail eller fil? Svarene sendes
  som koder (fx `annual`, `europe`); vil de hellere have teksterne?
- [x] **Fordeling (markedspraksis, 2026-11-10):** op til 3 partnere pr. lead,
  ligesom Findforsikring og Forsikringsportalen. Partnerne prioriteres i
  den rækkefølge, de står i `src/config/partners.ts`; først så hver valgt
  forsikring får mindst ét selskab, derefter fyldes op. Samtykketeksten
  siger "op til 3". Hvem der får hvilke typer, afgøres af aftalerne.
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
    hver dag. (Begge konkurrenter gemmer alt i 5 år; vi sletter mere og
    tidligere.)
  - Er vi **fælles dataansvarlige med Meta** for Pixel og Conversions API
    (som skrevet), og dækker EU-US Data Privacy Framework overførslen til
    Vercel og Meta?
  - **Betingelserne** siger, at vi ikke sælger forsikringer og ikke
    rådgiver. Passer det med svaret om Finanstilsynet nedenfor?
- [ ] **Privatlivspolitikken så kort som muligt (dit ønske, 2026-11-10; tages
  til sidst sammen med advokaten).** Den er indtil videre skrevet udførligt
  og ændres ikke mere nu. Til sidst kortes den ned, fx med kategorier
  ("databehandlere i EU og USA") i stedet for leverandørnavne. GDPR art. 13
  kræver dog stadig: dataansvarlig, formål og retsgrundlag, modtagere,
  overførsel uden for EU, opbevaringstid, rettigheder og klage til
  Datatilsynet. Kode: `src/app/privatlivspolitik/page.tsx`.
- [ ] **[Blokerer lancering] Samtykketeksten** er skrevet om efter
  markedspraksis (2026-11-10): op til 3 selskaber fra partnerlisten (med
  link til `/partnere`), telefon, e-mail og SMS, vores egen opfølgning, og
  tilbagetrækning via kontakt@nemforsikringstilbud.dk. Findforsikring
  navngiver 51 mulige modtagere; Forsikringsportalen nævner ingen navne
  ("op til 3 udbydere"). Advokaten skal godkende. Kode:
  `src/config/forms/consents.ts`.
- [ ] **[Blokerer lancering] Samtykke til markedsføring** (nyhedsbrev mv.)
  skal overholde markedsføringslovens § 10. Kode: samme fil.
- [ ] **[Blokerer lancering] Kræver det registrering hos Finanstilsynet?**
  Research (2026-11-10, ikke juridisk rådgivning):
  - **Hverken Findforsikring eller Forsikringsportalen er registreret** i
    Finanstilsynets register. Samlino er registreret, men de viser priser
    og sammenligner.
  - **Loven har en undtagelse, der passer på os:** lov om
    forsikringsformidling § 1, stk. 3, nr. 3: "levering af data og
    oplysninger om potentielle forsikringstagere" til forsikringsselskaber
    er ikke omfattet, så længe vi ikke gør mere for at hjælpe aftalen på
    plads.
  - **Vi bliver kun ved med at være undtaget, hvis vi:** ikke rådgiver,
    ikke viser priser, rangeringer eller sammenligninger, ikke kalder os
    "sammenligningstjeneste", ikke indhenter eller viser tilbud, og bliver
    betalt pr. lead (ikke pr. solgt forsikring). Det står nu som en fast
    regel for udviklingen.
  - Det gælder også liv og ulykke. Hold pensions- og opsparingsprodukter
    ude, og spørg aldrig om helbred eller familiens sygdomme.
  - **Partnerne vil spørge** (de må kun bruge formidlere med tilladelse,
    § 3, stk. 7). **Anbefaling:** bed Finanstilsynet om en skriftlig
    bekræftelse af, at modellen ikke kræver tilladelse, eller få advokaten
    til at skrive et kort notat. Det kan vises til partnerne.
- [ ] **Opbevaringstid (bygget 2026-11-10):** hver dag slettes forespørgslen
  12 måneder efter (svar, adresse, fødselsår, RKI, Meta-id'er), og efter 5
  år slettes også navn, e-mail, telefon og samtykker. Bekræft fristerne med
  advokaten. Ændres de, er det én linje: `src/config/retention.ts`
  (privatlivspolitikken følger med automatisk).
- [ ] **Databehandleraftaler** med Supabase, Vercel og GoHighLevel, og
  aftaler med partnerne om, hvem der er dataansvarlig for hvad.
- [ ] **Hele leadet i GoHighLevel (2026-11-10, dit valg):** GHL får alle
  data på leadet (også adresse, fødselsår, RKI og svarene), så du kan
  hjælpe kunden, når du ringer. GHL er amerikansk. Er det i orden efter
  GDPR's princip om dataminimering, og skal GHL slette efter de samme
  frister som os (12 måneder / 5 år)? Privatlivspolitikken siger nu, at
  GHL får hele forespørgslen.
- [ ] **Opfølgning på e-mail, SMS og telefon (modul 9):** vi kontakter
  brugeren efter et par dage for at høre, om selskaberne har ringet, på
  grundlag af legitim interesse (ikke markedsføring). Privatlivspolitikken
  siger det nu. Er det nok, eller skal det stå i samtykket?
- [ ] **Bevis for samtykke:** vi gemmer tidspunkt, den præcise tekst og
  versionen. Er det nok, eller skal IP-adresse også gemmes? (Ingen af
  konkurrenterne skriver, at de gemmer IP-adresse.)
- [ ] **[Blokerer lancering] Cookie-banner og tracking-samtykke:** teksten
  skal gennemgås, også fordi vi med samtykke sender hashede kontaktdata
  (e-mail, telefon, navn, postnummer og by) til Meta for at måle og optimere
  annoncer. Aldrig forsikringssvarene. Kode: `src/components/consent-banner.tsx`.

## Dig (forretning og indhold)

- [ ] **Brand:** navnet er Nemforsikringstilbud, og domænet
  nemforsikringstilbud.dk er købt. Farverne er valgt. Mangler: logo (du
  laver det; indtil da står navnet med et skjold-ikon), og at domænet
  kobles på Vercel (se "Konti og adgang").
- [ ] **[Blokerer lancering] Firmaoplysninger:** siderne skriver kun "Hero
  Media" (dit valg indtil videre, 2026-11-10). E-handelsloven § 7 kræver
  det fulde firmanavn (fx "Hero Media ApS"), CVR-nummer og adresse, og
  privatlivspolitikken skal sige, hvem der er dataansvarlig. Adressen kan
  være firmaets adresse fra CVR-registret. Tages til sidst, før
  lancering. Kode: `COMPANY` i `src/config/site.ts`.
- [x] **E-mailen kontakt@nemforsikringstilbud.dk er oprettet** (2026-11-10).
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

- [x] **Databaseændringerne for GHL og medlemskab er kørt i produktion**
  (2026-11-10, efter test på dev).
- [ ] **Sæt opfølgningen op i GoHighLevel (modul 9, til sidst):** brugerdefinerede
  felter, et spørgeskema og to workflows (opfølgning efter 3 dage og
  svarene tilbage til os), plus to nøgler i Vercel:
  `GHL_INBOUND_WEBHOOK_URL` og `GHL_FEEDBACK_SECRET`. Trin for trin:
  `src/lib/integrations/ghl/README.md`. Indtil da er opfølgningen slået fra,
  og alt andet virker.
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

- [x] **Supabase er opgraderet til Pro** (2026-11-10): daglige backups af
  produktion, ingen automatisk pause. Dev ligger i samme organisation og
  koster ca. $10/md; det er fint. Sikkerhedsgennemgang af begge projekter
  kørt: ingen problemer.
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
  Supabase Pro er nu på plads (2026-11-10). Anbefaling: byg det efter
  lanceringen; MotorAPI virker til at starte med.
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

- 2026-11-10: Vi forklarer ikke på forsiden og "Om os", hvordan vi tjener
  penge. I stedet står vores mission: kunden har ret til at kende sine
  muligheder og fortjener forsikringer, der passer. Vi skriver aldrig, at
  vi finder "den rette forsikring" til kunden (det er rådgivning, se
  Finanstilsynet); kunden vælger selv. Linjen om, at selskaberne betaler
  os, bliver stående i betingelserne (advokaten vurderer).

- 2026-11-10: Modul 9 bygges med GoHighLevel (ikke Brevo). GHL får hele
  leadet med et læsbart resumé af svarene til opkald (opdateret samme dag;
  først kun kontaktoplysninger); GHL sender et
  spørgeskema på e-mail/SMS efter 3 dage, beder tilfredse om en
  Trustpilot-anmeldelse og laver en opkaldsopgave, hvis ingen har
  kontaktet kunden. Svarene kommer tilbage og gemmes på leadet. Vi ringer
  ikke til alle leads.

- 2026-11-10: Vi bygger backend og hjemmeside færdig først. Det praktiske
  (firmaoplysninger, betalinger, advokat, nøgler, domæne, partnere) står
  her på listen og tages til sidst, før lancering.

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
- 2026-11-10: Udgangspunkt for spørgsmålene er Findforsikring (de sender
  allerede leads til de samme selskaber): vi spørger om det samme eller
  mere. Tilføjet samme dag: adresse ved ejerskifte (med BBR), mærke og
  model på camping og båd, topfart på båd, antal børn ved ulykke og rejse
  for hele familien, bortkomst på dyreforsikring. Partnerne spørges kun om
  levering, resultater og prisgrupper.
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
