import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/config/site";
import { ConsentProvider } from "@/lib/tracking/consent-context";
import { MetaPixel } from "@/lib/tracking/meta-pixel";
import "./globals.css";

// One family for everything (headings, text, form): IBM Plex Sans, the
// font of the Danish public design system (borger.dk), chosen for
// legibility and clear æ, ø and å.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name}: få tilbud på dine forsikringer`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Få tilbud på bil-, indbo-, hus- og andre forsikringer. Udfyld én formular, gratis og uforpligtende.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${plexSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ConsentProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <ConsentBanner />
          <MetaPixel />
        </ConsentProvider>
      </body>
    </html>
  );
}
