import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/consent-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ConsentProvider } from "@/lib/tracking/consent-context";
import { MetaPixel } from "@/lib/tracking/meta-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sammenlign forsikringer",
    template: "%s | Sammenlign forsikringer",
  },
  description:
    "Få tilbud på bilforsikring, indboforsikring og husforsikring ét sted.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
