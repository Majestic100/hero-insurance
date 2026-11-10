import Link from "next/link";

import { SITE } from "@/config/site";
import { ConsentSettingsButton } from "./consent-banner";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {SITE.name}
        </p>
        <div className="flex flex-wrap gap-x-6">
          <Link
            href="/privatlivspolitik"
            className="flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            Privatlivspolitik
          </Link>
          <ConsentSettingsButton />
        </div>
      </div>
    </footer>
  );
}
