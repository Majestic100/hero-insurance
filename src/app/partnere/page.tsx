import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/marketing/content-page";
import { INSURANCE_TYPE_INFO } from "@/config/forms/insurance-types";
import { PARTNERS } from "@/config/partners";

export const metadata: Metadata = {
  title: "Partnere",
  description:
    "De forsikringsselskaber, der kan modtage din forespørgsel, og hvilke forsikringer de tilbyder.",
};

/**
 * The recipients of leads, rendered from src/config/partners.ts (the same
 * list that routes the leads), so the consent always points at the real
 * recipients.
 */
export default function PartnersPage() {
  return (
    <ContentPage
      title="Vores partnere"
      intro={
        <p>
          Når du giver samtykke, sender vi din forespørgsel til op til 3 af
          selskaberne på listen, som tilbyder de forsikringer, du har valgt.
          Kun dem.
        </p>
      }
    >
      {PARTNERS.length === 0 ? (
        <p className="rounded-lg border bg-cream p-4">
          Vi er ved at indgå aftaler med forsikringsselskaber. Listen bliver
          vist her, før vi sender oplysninger videre til nogen.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Selskab</th>
                <th>Modtager forespørgsler på</th>
              </tr>
            </thead>
            <tbody>
              {PARTNERS.map((partner) => (
                <tr key={partner.id}>
                  <td className="font-medium">{partner.name}</td>
                  <td>
                    {partner.insuranceTypes
                      .map((type) => INSURANCE_TYPE_INFO[type].shortLabel)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p>
        Selskaberne er selv dataansvarlige for de oplysninger, de modtager. Læs
        mere i vores <Link href="/privatlivspolitik">privatlivspolitik</Link>.
      </p>
      <p>
        Er du et forsikringsselskab? <Link href="/bliv-partner">Bliv partner</Link>.
      </p>
    </ContentPage>
  );
}
