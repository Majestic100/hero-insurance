import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, Geist_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/config/site";
import { ConsentProvider } from "@/lib/tracking/consent-context";
import { MetaPixel } from "@/lib/tracking/meta-pixel";
import "./globals.css";

// Body text, the form and buttons: friendly and easy to read at small sizes.
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

// Headings and the logo: a warm grotesque with character.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
      className={`${figtree.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
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
