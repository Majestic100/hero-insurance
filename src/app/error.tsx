"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * Shown when a page fails while rendering. The header and footer from the
 * root layout stay. Logs only the error digest, never personal data.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    const digest =
      typeof error === "object" && error !== null && "digest" in error
        ? String((error as { digest?: unknown }).digest)
        : undefined;
    console.error("[page error]", digest ?? "no digest");
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold">Noget gik galt</h1>
      <p className="text-muted-foreground">
        Siden kunne ikke vises lige nu. Prøv igen om lidt. Dine svar i
        formularen er gemt i denne fane, så du ikke skal starte forfra.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="cta" className="h-11" onClick={() => retry()}>
          Prøv igen
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link href="/">Til forsiden</Link>
        </Button>
      </div>
    </main>
  );
}
