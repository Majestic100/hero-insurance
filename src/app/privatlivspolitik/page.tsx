import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
};

/**
 * Placeholder. The real privacy policy needs legal review before launch
 * (docs/huskeliste.md). The consent on the last form step links here.
 */
export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-10 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privatlivspolitik</h1>
      <p className="text-muted-foreground">
        Vores privatlivspolitik er under udarbejdelse og bliver offentliggjort
        her, før vi begynder at modtage forespørgsler.
      </p>
    </main>
  );
}
