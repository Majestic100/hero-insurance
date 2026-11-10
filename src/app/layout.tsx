import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/config/site";
import { ConsentProvider } from "@/lib/tracking/consent-context";
import { MetaPixel } from "@/lib/tracking/meta-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Headings on marketing pages (not in the form, which stays in Geist).
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
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
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
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
