import { INSURANCE_TYPES, type InsuranceType } from "./forms/insurance-types";

/**
 * Landing pages per insurance type (/bilforsikring etc.), for ads and
 * search. Short on purpose: the goal is to get the visitor into the form
 * with the type preselected. Content is data, rendered by
 * src/components/marketing/landing-page.tsx.
 *
 * Keep the texts general and true for the Danish market. No prices or
 * numbers we cannot document.
 */

export type LandingPageContent = {
  insuranceType: InsuranceType;
  /** Route path, also the canonical URL. */
  path: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  intro: string;
  coverage: { title: string; items: readonly { title: string; text: string }[] };
  priceFactors: { title: string; items: readonly string[] };
  faq: readonly { question: string; answer: string }[];
};

export const LANDING_PAGES = {
  car: {
    insuranceType: "car",
    path: "/bilforsikring",
    metaTitle: "Bilforsikring: få tilbud på din bilforsikring",
    metaDescription:
      "Få tilbud på bilforsikring fra forsikringsselskaberne. Skriv din nummerplade, så finder vi bilen. Gratis og uforpligtende.",
    heading: "Få tilbud på din bilforsikring",
    intro:
      "Skriv din nummerplade, så henter vi bilens oplysninger i Motorregistret. Svar på få spørgsmål, og lad forsikringsselskaberne give dig et bud.",
    coverage: {
      title: "Hvad dækker en bilforsikring?",
      items: [
        {
          title: "Ansvarsforsikring",
          text: "Lovpligtig for alle indregistrerede biler. Dækker skader, du laver på andre personer og deres ting.",
        },
        {
          title: "Kaskoforsikring",
          text: "Frivillig. Dækker skader på din egen bil, fx ved uheld, brand og tyveri. Kræves ofte, hvis bilen er købt på lån eller leaset.",
        },
        {
          title: "Tilvalg",
          text: "Fx vejhjælp, glasskade, førerpladsdækning og lånebil. Vælg kun det, du har brug for.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Bilens mærke, model, alder og værdi",
        "Hvor langt du kører om året",
        "Alderen på den, der kører mest i bilen",
        "Antal år uden skader",
        "Hvor du bor",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Skal jeg kende bilens data?",
        answer:
          "Nej. Skriv nummerpladen, så henter vi mærke, model og motor i Motorregistret. Har bilen ikke nummerplade endnu, skriver du selv mærke, model og årgang.",
      },
      {
        question: "Kan jeg skifte bilforsikring når som helst?",
        answer:
          "Det afhænger af dine nuværende vilkår. Mange forsikringer kan opsiges med kort varsel, og det nye selskab kan ofte hjælpe med at opsige den gamle.",
      },
      {
        question: "Hvad hvis jeg kører i en firmabil eller leasingbil?",
        answer:
          "Du kan stadig få tilbud. Ved leasing kræver leasingselskabet som regel kasko, så husk at vælge det.",
      },
    ],
  },
  home_contents: {
    insuranceType: "home_contents",
    path: "/indboforsikring",
    metaTitle: "Indboforsikring: få tilbud på din indboforsikring",
    metaDescription:
      "Få tilbud på indboforsikring, uanset om du bor til leje eller ejer. Gratis og uforpligtende.",
    heading: "Få tilbud på din indboforsikring",
    intro:
      "Indboforsikringen dækker dine ting derhjemme, og den er en af de vigtigste forsikringer for alle husstande. Skriv din adresse, og svar på få spørgsmål.",
    coverage: {
      title: "Hvad dækker en indboforsikring?",
      items: [
        {
          title: "Dine ting",
          text: "Møbler, tøj, elektronik og andre ting i hjemmet ved fx brand, vandskade, indbrud og tyveri.",
        },
        {
          title: "Ansvar",
          text: "Skader, du eller din husstand laver på andre personer og deres ting. Ofte inkluderet i indboforsikringen.",
        },
        {
          title: "Retshjælp og tilvalg",
          text: "Retshjælp er typisk med. Du kan ofte tilvælge fx elektronikdækning, cykeldækning og pludselig skade.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Hvor meget dit indbo er værd (forsikringssummen)",
        "Boligens størrelse og type",
        "Hvor du bor",
        "Hvor mange I er i husstanden",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Hvor meget er mit indbo værd?",
        answer:
          "Mange undervurderer det. Tænk på, hvad det ville koste at købe alt nyt: møbler, tøj, køkkenting og elektronik. Vælger du for lav en sum, kan du få mindre udbetalt ved en skade.",
      },
      {
        question: "Skal jeg have indboforsikring, når jeg bor til leje?",
        answer:
          "Ja, det anbefales. Udlejers forsikring dækker bygningen, ikke dine ting og ikke dit ansvar.",
      },
      {
        question: "Er cyklen dækket?",
        answer:
          "Ofte kun op til et bestemt beløb. Har du en dyr cykel, så spørg om en udvidet cykeldækning, når du får tilbud.",
      },
    ],
  },
  house: {
    insuranceType: "house",
    path: "/husforsikring",
    metaTitle: "Husforsikring: få tilbud på din husforsikring",
    metaDescription:
      "Få tilbud på husforsikring. Skriv adressen, så henter vi husets data i BBR. Gratis og uforpligtende.",
    heading: "Få tilbud på din husforsikring",
    intro:
      "Skriv husets adresse, så henter vi boligareal, byggeår og tagtype i BBR. Du kan altid rette tallene, før du sender.",
    coverage: {
      title: "Hvad dækker en husforsikring?",
      items: [
        {
          title: "Bygningen",
          text: "Skader på huset ved fx brand, storm, skybrud og indbrud. Kræves som regel, hvis huset har lån.",
        },
        {
          title: "Rør og installationer",
          text: "Skjulte rør og stikledninger er ofte et tilvalg. Det er dyre skader, så overvej det.",
        },
        {
          title: "Svamp og insekter",
          text: "Dækning mod svamp og insektangreb indgår typisk i en husforsikring.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Husets størrelse og byggeår",
        "Tagtype (fx tegl, strå eller tagpap)",
        "Hvor huset ligger",
        "Hvilke tilvalg du vælger, fx rør og stikledninger",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Hvorfor spørger I om tagtypen?",
        answer:
          "Taget betyder meget for prisen, især stråtag. Vi henter tagtypen i BBR, og du kan rette den, hvis den ikke passer.",
      },
      {
        question: "Har jeg brug for indboforsikring også?",
        answer:
          "Ja. Husforsikringen dækker bygningen, indboforsikringen dækker dine ting. Du kan få tilbud på begge i samme formular.",
      },
      {
        question: "Jeg skal købe hus. Kan jeg få tilbud nu?",
        answer:
          "Ja. Vælg også ejerskifteforsikring, hvis du skal købe, så får du tilbud på begge dele.",
      },
    ],
  },
  accident_health: {
    insuranceType: "accident_health",
    path: "/ulykkesforsikring",
    metaTitle: "Ulykkesforsikring: få tilbud på ulykkesforsikring",
    metaDescription:
      "Få tilbud på ulykkes- og sundhedsforsikring til dig og din familie. Gratis og uforpligtende.",
    heading: "Få tilbud på ulykkesforsikring",
    intro:
      "En ulykkesforsikring giver dig et beløb, hvis du kommer til skade og får varige men. Svar på få spørgsmål, og lad forsikringsselskaberne give dig et bud. Vi spørger aldrig om dit helbred.",
    coverage: {
      title: "Hvad dækker en ulykkesforsikring?",
      items: [
        {
          title: "Varigt mén",
          text: "Et engangsbeløb, hvis en ulykke giver dig varige følger. Beløbet afhænger af méngraden og din forsikringssum.",
        },
        {
          title: "Fritid og arbejde",
          text: "Arbejdsskader dækkes af arbejdsgiverens forsikring. En privat ulykkesforsikring dækker typisk i fritiden og ofte også i arbejdstiden.",
        },
        {
          title: "Behandling",
          text: "Mange forsikringer dækker også fx tandskader og udgifter til behandling efter en ulykke.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Hvor høj en forsikringssum du vælger",
        "Din alder",
        "Dit arbejde (fx kontor eller fysisk arbejde)",
        "Om forsikringen også gælder i arbejdstiden",
        "Om flere i familien skal med",
      ],
    },
    faq: [
      {
        question: "Spørger I om mit helbred?",
        answer:
          "Nej. Det er følsomme oplysninger, så vi spørger ikke om helbred eller rygning. Har selskabet brug for det, spørger de dig selv.",
      },
      {
        question: "Kan jeg forsikre mine børn?",
        answer:
          "Ja. Du kan vælge, hvem der skal være med, når du udfylder formularen.",
      },
      {
        question: "Hvad er forskellen på ulykkes- og sundhedsforsikring?",
        answer:
          "En ulykkesforsikring giver penge ved varige men efter en ulykke. En sundhedsforsikring betaler for fx behandling hos privathospital eller fysioterapeut ved sygdom.",
      },
    ],
  },
  travel: {
    insuranceType: "travel",
    path: "/rejseforsikring",
    metaTitle: "Rejseforsikring: få tilbud på din rejseforsikring",
    metaDescription:
      "Få tilbud på rejseforsikring til en enkelt rejse eller hele året, i Europa eller hele verden. Gratis og uforpligtende.",
    heading: "Få tilbud på din rejseforsikring",
    intro:
      "Vælg, om du rejser én gang eller flere gange om året, hvor du skal hen, og hvem der skal med. Så giver forsikringsselskaberne dig et bud.",
    coverage: {
      title: "Hvad dækker en rejseforsikring?",
      items: [
        {
          title: "Sygdom og hjemtransport",
          text: "Behandling og hjemtransport, hvis du bliver syg eller kommer til skade på rejsen. Det gule sygesikringskort dækker kun en del i Europa.",
        },
        {
          title: "Bagage og forsinkelse",
          text: "Mistet eller beskadiget bagage, og udgifter hvis fly eller bagage bliver forsinket.",
        },
        {
          title: "Afbestilling",
          text: "Et tilvalg, der dækker, hvis du må aflyse rejsen, fx på grund af sygdom.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Helårs- eller enkeltrejseforsikring",
        "Europa eller hele verden",
        "Hvor mange der skal være dækket",
        "Om du vælger afbestillingsforsikring",
        "Din alder",
      ],
    },
    faq: [
      {
        question: "Har jeg allerede en rejseforsikring?",
        answer:
          "Måske. Nogle indboforsikringer og kreditkort har rejsedækning. Tjek dine vilkår, før du køber en ny.",
      },
      {
        question: "Hvornår kan en helårsrejseforsikring betale sig?",
        answer:
          "Ofte allerede ved to rejser om året. Den dækker alle rejser i et år, typisk med en grænse for, hvor længe hver rejse må vare.",
      },
      {
        question: "Hvad med det blå sygesikringskort?",
        answer:
          "Det dækker nødvendig behandling på offentlige hospitaler i EU, men ikke fx hjemtransport. En rejseforsikring dækker mere.",
      },
    ],
  },
  holiday_home: {
    insuranceType: "holiday_home",
    path: "/fritidshusforsikring",
    metaTitle: "Fritidshusforsikring: få tilbud på forsikring til sommerhuset",
    metaDescription:
      "Få tilbud på forsikring til dit sommerhus eller kolonihavehus. Skriv adressen, så henter vi husets data i BBR.",
    heading: "Få tilbud på forsikring til dit fritidshus",
    intro:
      "Skriv fritidshusets adresse, så henter vi areal, byggeår og tagtype i BBR. Du kan altid rette tallene, før du sender.",
    coverage: {
      title: "Hvad dækker en fritidshusforsikring?",
      items: [
        {
          title: "Bygningen",
          text: "Skader på huset ved fx brand, storm, skybrud og indbrud.",
        },
        {
          title: "Indbo i fritidshuset",
          text: "Dine ting i huset er ofte ikke dækket af din almindelige indboforsikring. Spørg efter indbodækning til fritidshuset.",
        },
        {
          title: "Udlejning",
          text: "Lejer du huset ud, skal forsikringen kende til det. Fortæl det, når du beder om tilbud.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Husets størrelse og byggeår",
        "Tagtype, især stråtag",
        "Hvor huset ligger, fx tæt på vandet",
        "Om du lejer huset ud",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Hvorfor spørger I, om jeg lejer huset ud?",
        answer:
          "Udlejning øger risikoen for skader, og nogle forsikringer dækker ikke, hvis selskabet ikke ved det.",
      },
      {
        question: "Er et kolonihavehus også et fritidshus?",
        answer: "Ja. Vælg kolonihavehus, når du udfylder formularen.",
      },
      {
        question: "Står huset tomt om vinteren?",
        answer:
          "Mange forsikringer stiller krav, fx om at lukke for vandet. Læs vilkårene i de tilbud, du får.",
      },
    ],
  },
  motorcycle_atv_moped: {
    insuranceType: "motorcycle_atv_moped",
    path: "/mc-forsikring",
    metaTitle: "MC-forsikring: få tilbud på forsikring til MC, ATV og knallert",
    metaDescription:
      "Få tilbud på forsikring til motorcykel, ATV eller knallert. Skriv nummerpladen, så henter vi køretøjets data.",
    heading: "Få tilbud på forsikring til MC, ATV eller knallert",
    intro:
      "Skriv nummerpladen, så henter vi køretøjets oplysninger i Motorregistret. Svar på få spørgsmål, og lad forsikringsselskaberne give dig et bud.",
    coverage: {
      title: "Hvad dækker forsikringen?",
      items: [
        {
          title: "Ansvarsforsikring",
          text: "Lovpligtig for motorcykler, ATV'er og knallerter på offentlig vej. Dækker skader, du laver på andre.",
        },
        {
          title: "Kaskoforsikring",
          text: "Frivillig. Dækker skader på dit eget køretøj, fx ved uheld, brand og tyveri.",
        },
        {
          title: "Tilvalg",
          text: "Fx førerulykkesdækning og dækning af beklædning og hjelm.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Køretøjets type, alder og værdi",
        "Din alder og erfaring",
        "Antal år uden skader",
        "Hvor du bor",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Skal en knallert 30 forsikres?",
        answer: "Ja. Alle knallerter skal have en lovpligtig ansvarsforsikring.",
      },
      {
        question: "Kan jeg få tilbud uden nummerplade?",
        answer:
          "Ja. Nummerpladen er valgfri. Lad feltet stå tomt, hvis køretøjet ikke har en endnu.",
      },
      {
        question: "Kører jeg kun om sommeren?",
        answer:
          "Nogle selskaber tilbyder sæsonforsikring eller rabat ved afmelding om vinteren. Spørg, når du får tilbud.",
      },
    ],
  },
  boat: {
    insuranceType: "boat",
    path: "/baadforsikring",
    metaTitle: "Bådforsikring: få tilbud på forsikring til din båd",
    metaDescription:
      "Få tilbud på forsikring til sejlbåd, motorbåd eller speedbåd. Gratis og uforpligtende.",
    heading: "Få tilbud på din bådforsikring",
    intro:
      "Fortæl os om din båd, hvor den ligger, og hvor du sejler. Så giver forsikringsselskaberne dig et bud.",
    coverage: {
      title: "Hvad dækker en bådforsikring?",
      items: [
        {
          title: "Ansvar",
          text: "Skader, du laver på andre både, personer og ting. Kræves ofte af havnen, og lovpligtig for hurtige motorbåde.",
        },
        {
          title: "Kasko",
          text: "Skader på din egen båd, fx ved grundstødning, storm, brand og tyveri.",
        },
        {
          title: "Udstyr og motor",
          text: "Elektronik, sejl og påhængsmotor kan kræve en særlig dækning.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Bådens type, længde, værdi og alder",
        "Motorens størrelse",
        "Hvor båden ligger (havn, trailer eller land)",
        "Hvor du sejler",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Skal min båd forsikres?",
        answer:
          "Ansvarsforsikring er lovpligtig for motorbåde, der kan sejle hurtigt, og mange havne kræver den. Kasko er frivillig.",
      },
      {
        question: "Er jollen eller kajakken dækket af indboforsikringen?",
        answer:
          "Små både er nogle gange dækket af indboforsikringen. Tjek dine vilkår, eller vælg en bådforsikring for at være sikker.",
      },
      {
        question: "Sejler jeg til udlandet?",
        answer:
          "Fortæl, hvor du sejler, når du udfylder formularen. Dækningsområdet påvirker både pris og vilkår.",
      },
    ],
  },
  caravan: {
    insuranceType: "caravan",
    path: "/campingforsikring",
    metaTitle: "Campingforsikring: få tilbud på campingvogn og autocamper",
    metaDescription:
      "Få tilbud på forsikring til campingvogn, autocamper eller teltvogn. Gratis og uforpligtende.",
    heading: "Få tilbud på forsikring til din campingvogn",
    intro:
      "Skriv nummerpladen, så henter vi oplysningerne i Motorregistret. Fortæl, hvad den er værd, og hvilken dækning du ønsker.",
    coverage: {
      title: "Hvad dækker en campingforsikring?",
      items: [
        {
          title: "Kasko",
          text: "Skader på selve vognen, fx ved uheld, storm, brand og tyveri. Det er det vigtigste for en campingvogn.",
        },
        {
          title: "Ansvar",
          text: "En autocamper skal have lovpligtig ansvarsforsikring. For en campingvogn dækker bilens ansvarsforsikring, når den er koblet til.",
        },
        {
          title: "Indbo i vognen",
          text: "Dine ting i vognen. Tjek, om din indboforsikring dækker dem, eller om du skal vælge en dækning til.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Vognens type, årgang og værdi",
        "Om den står fast på en campingplads",
        "Hvilken dækning du vælger",
        "Hvor stor en selvrisiko du vælger",
      ],
    },
    faq: [
      {
        question: "Er min campingvogn dækket af bilforsikringen?",
        answer:
          "Bilens ansvarsforsikring dækker skader, campingvognen laver på andre, når den er koblet til. Skader på selve campingvognen kræver en kaskoforsikring.",
      },
      {
        question: "Står vognen fast på en campingplads?",
        answer:
          "Fortæl det, når du beder om tilbud. Det påvirker både pris og dækning.",
      },
      {
        question: "Kan jeg få tilbud på en autocamper?",
        answer: "Ja. Vælg autocamper, når du udfylder formularen.",
      },
    ],
  },
  pet: {
    insuranceType: "pet",
    path: "/dyreforsikring",
    metaTitle: "Dyreforsikring: få tilbud på forsikring til hund, kat og hest",
    metaDescription:
      "Få tilbud på syge-, livs- og ansvarsforsikring til din hund, kat eller hest. Gratis og uforpligtende.",
    heading: "Få tilbud på forsikring til dit dyr",
    intro:
      "Fortæl os om dit dyr, og hvad du vil have dækket. Så giver forsikringsselskaberne dig et bud.",
    coverage: {
      title: "Hvad dækker en dyreforsikring?",
      items: [
        {
          title: "Sygdom og dyrlæge",
          text: "Dyrlægeregninger, hvis dyret bliver syg eller kommer til skade. Det er dyrt uden forsikring.",
        },
        {
          title: "Ansvar",
          text: "Lovpligtig for hunde. Dækker skader, dyret laver på andre personer og deres ting.",
        },
        {
          title: "Livsforsikring",
          text: "Et beløb, hvis dyret dør eller må aflives.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Dyrets art, race og alder",
        "Hvilke dækninger du vælger",
        "Hvor stor en selvrisiko du vælger",
        "Hvor du bor",
      ],
    },
    faq: [
      {
        question: "Skal min hund have ansvarsforsikring?",
        answer:
          "Ja. Det er lovpligtigt for alle hunde i Danmark. Den kan være med i din indboforsikring, så tjek dine vilkår.",
      },
      {
        question: "Hvornår skal jeg forsikre mit dyr?",
        answer:
          "Gerne mens det er ungt og rask. Sygdomme, dyret allerede har, er typisk ikke dækket.",
      },
      {
        question: "Kan jeg forsikre en hest?",
        answer: "Ja. Vælg hest, når du udfylder formularen.",
      },
    ],
  },
  life: {
    insuranceType: "life",
    path: "/livsforsikring",
    metaTitle: "Livsforsikring: få tilbud på livsforsikring",
    metaDescription:
      "Få tilbud på livsforsikring, der sikrer din familie eller dit boliglån. Gratis og uforpligtende.",
    heading: "Få tilbud på livsforsikring",
    intro:
      "En livsforsikring udbetaler et beløb til dine efterladte, hvis du dør. Vælg beløbet, og hvad forsikringen skal sikre. Vi spørger aldrig om dit helbred.",
    coverage: {
      title: "Hvad dækker en livsforsikring?",
      items: [
        {
          title: "Udbetaling ved død",
          text: "Et engangsbeløb til dine efterladte, så de kan blive boende og klare økonomien.",
        },
        {
          title: "Boliglån",
          text: "Mange vælger et beløb, der kan betale boliglånet, så familien ikke skal sælge huset.",
        },
        {
          title: "Kritisk sygdom",
          text: "Nogle livsforsikringer kan udvides med en udbetaling ved fx kræft eller hjertesygdom.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Hvor stort beløbet er",
        "Din alder",
        "Dit arbejde",
        "Dit helbred, som selskabet spørger dig om selv",
      ],
    },
    faq: [
      {
        question: "Har jeg allerede en livsforsikring?",
        answer:
          "Mange har en gennem deres pensionsordning på arbejdet. Tjek den, før du køber en ny, så du ikke betaler to gange.",
      },
      {
        question: "Hvor stort et beløb skal jeg vælge?",
        answer:
          "En tommelfingerregel er nok til at betale boliglånet og nogle års udgifter for familien. Vælg \"Ved ikke\", så hjælper selskabet dig.",
      },
      {
        question: "Hvorfor spørger I ikke om mit helbred?",
        answer:
          "Det er følsomme oplysninger, som vi ikke vil gemme. Selskabet spørger dig selv, når de giver dig et tilbud.",
      },
    ],
  },
  change_of_ownership: {
    insuranceType: "change_of_ownership",
    path: "/ejerskifteforsikring",
    metaTitle: "Ejerskifteforsikring: få tilbud, når du sælger eller køber bolig",
    metaDescription:
      "Få tilbud på ejerskifteforsikring, når du sælger eller køber hus. Gratis og uforpligtende.",
    heading: "Få tilbud på ejerskifteforsikring",
    intro:
      "Skal du sælge eller købe hus? Fortæl os om boligen, så giver forsikringsselskaberne dig et bud på ejerskifteforsikringen.",
    coverage: {
      title: "Hvad dækker en ejerskifteforsikring?",
      items: [
        {
          title: "Skjulte fejl",
          text: "Fejl og skader, som ikke står i tilstandsrapporten og elinstallationsrapporten, fx skjulte vandskader eller fejl i taget.",
        },
        {
          title: "Sælger slipper for ansvaret",
          text: "Tilbyder sælger en ejerskifteforsikring og betaler halvdelen, er sælger som udgangspunkt fri for ansvaret for skjulte fejl.",
        },
        {
          title: "Udvidet dækning",
          text: "Dækningen kan udvides, fx til stikledninger. Det koster mere, men dyre skader dækkes.",
        },
      ],
    },
    priceFactors: {
      title: "Det påvirker prisen",
      items: [
        "Boligens pris, størrelse og byggeår",
        "Hvad tilstandsrapporten viser",
        "Hvor lang dækningsperioden er",
        "Om du vælger udvidet dækning",
      ],
    },
    faq: [
      {
        question: "Hvem betaler ejerskifteforsikringen?",
        answer:
          "Køber tegner den. Sælger skal tilbyde den og betale halvdelen for at slippe for ansvaret for skjulte fejl.",
      },
      {
        question: "Hvad skal være klar?",
        answer:
          "Tilstandsrapport og elinstallationsrapport. Du kan godt få tilbud, før de er lavet.",
      },
      {
        question: "Kan jeg få tilbud, både når jeg sælger og køber?",
        answer: "Ja. Vælg, om du er sælger eller køber, når du udfylder formularen.",
      },
    ],
  },
} as const satisfies Record<InsuranceType, LandingPageContent>;

/** The landing pages, in the order shown in the footer. */
export const LANDING_PAGE_LIST: readonly LandingPageContent[] = INSURANCE_TYPES.map(
  (type) => LANDING_PAGES[type],
);
