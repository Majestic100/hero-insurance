import type { InsuranceType } from "./forms/insurance-types";

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
} as const satisfies Partial<Record<InsuranceType, LandingPageContent>>;

/** The landing pages, in the order shown in the footer. */
export const LANDING_PAGE_LIST: readonly LandingPageContent[] = [
  LANDING_PAGES.car,
  LANDING_PAGES.home_contents,
  LANDING_PAGES.house,
  LANDING_PAGES.accident_health,
];
