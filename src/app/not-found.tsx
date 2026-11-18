import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Siden findes ikke",
};

/** 404 for unknown URLs and notFound(). Next.js adds noindex itself. */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-4 py-16">
      <p className="text-sm font-medium text-primary">Fejl 404</p>
      <h1 className="font-heading text-3xl font-semibold">Siden findes ikke</h1>
      <p className="text-muted-foreground">
        Linket er måske forældet, eller adressen er skrevet forkert.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="cta" className="h-11">
          <Link href="/tilbud">Få tilbud på forsikring</Link>
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link href="/">Til forsiden</Link>
        </Button>
      </div>
    </main>
  );
}
