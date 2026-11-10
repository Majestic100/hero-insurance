# Findforsikring.dk: questions per insurance type

Read on 2026-11-10 from https://www.findforsikring.dk/indhent-tilbud with a
headless browser (the form was opened, never submitted). Reference for our
own form config in `src/config/forms/steps/`. Their flow: pick types, then
one step per type, then one contact step. Optional extras sit behind "Vis
flere detaljer (valgfrit)". Every type step has a savings banner, free text
("Evt. andre relevante oplysninger") and a cross-sell box (Ulykke, Indbo).

| Type | Their questions (* = required) |
| --- | --- |
| Bil | Kender du nummerpladen? Ja/Nej; Nummerplade (DK band); Mærke* (searchable, ~65 makes); Model* (depends on make); Drivmiddel (Benzin, Diesel, El, Hybrid - Benzin, Hybrid - Diesel, Ved ikke); Årgang; Motorstørrelse (liter); Antal år med egen bil (0-10, 10+); Ønsker til dækning* (Ansvar / Ansvars- og kasko); free text |
| Indbo | Adresse*; Alder på den ældste i husstanden; free text |
| Hus | Adresse*; Tagtype (Hårdt tag, Fladt tag, Stråtag, Andet, Ved ikke); Opførelsesår; Boligareal; Boligtype (Hus (villa), Rækkehus, Landejendom, Nedlagt landbrug, Anden); free text |
| Sommerhus | Adresse*; Tagtype (as Hus); Boligareal; Boligtype (Sommerhus, Kolonihavehus, Ved ikke); Opførelsesår; free text |
| Ejerskifte | Adresse*; Boligareal; Boligtype (7 BBR types); Opførelsesår; upload of tilstands- and elrapport (optional); free text |
| Ulykke | Antal voksne* (0, 1, 2, 2+); Antal børn* (0-3, 3+); free text |
| Sundhed | Same as Ulykke |
| Rejse | Antal voksne*; Antal børn* (0-4, 4+); Dækning (Europa, Verden, Ved ikke); Type (Års-, Enkeltrejse); Afbestilling Ja/Nej; free text |
| Liv | Navn*; Alder*; Branche (21 options); Forsikringssum ved død (amount or Ved ikke); "add a person"; free text |
| Dyr | Art* (Hund, Kat, Hest, Fugl, Andet); Navn; Race; Fødselsår; Dækninger (Ansvar, Liv, Syge, Bortkomst); "add another animal"; free text |
| Camping | Kender du nummerpladen?; Nummerplade; Mærke og model*; Type (Campingvogn, Camp-let, På fast sted, Andet); Årgang; Ca. værdi; Kasko? (Kun ansvar / Ansvar og kasko); free text |
| Båd | Mærke og model*; Antal fod; Ca. topfart; Antal HK; Motortype (Indenbords, Påhængsmotor, Andet, Ved ikke); Byggeår; Liggeplads (Havn, Trailer, Land, Andet); Dækningsområde (Dansk, Skandinavisk, Europæisk, Internationalt farvand, Ved ikke); Dækninger (Ansvar obligatorisk, Kasko); free text |

**Contact step (once):** Telefon* ("Deles kun med de selskaber der skal give
dig tilbud"), Navn* (one field), E-mail*, Alder*, Adresse*, Postnummer, Er
du i RKI?* (Nej/Ja/Ved ikke), Boligtype, membership of an organisation,
a-kasse offer, company name, primary insurer, one consent checkbox, savings
summary and Trustpilot next to the submit button.
