"use client";

import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export function SiteHeader() {
  // No "Få tilbud" button inside the form itself.
  const inForm = usePathname().startsWith("/tilbud");
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        {/* Placeholder wordmark until the logo is ready. */}
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-heading text-lg font-semibold"
        >
          <ShieldCheckIcon aria-hidden className="size-5 text-brand" />
          {SITE.name}
        </Link>
        {!inForm && (
          <Button asChild size="sm" className="hidden h-10 sm:inline-flex">
            <Link href="/tilbud">Få tilbud</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
