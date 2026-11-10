import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        {/* Placeholder wordmark until the logo is ready. */}
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 font-semibold tracking-tight"
        >
          <ShieldCheckIcon aria-hidden className="size-5 text-brand" />
          {SITE.name}
        </Link>
        <Button asChild size="sm" className="hidden h-10 sm:inline-flex">
          <Link href="/tilbud">Få tilbud</Link>
        </Button>
      </div>
    </header>
  );
}
