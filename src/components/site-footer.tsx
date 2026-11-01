import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-x-6 px-4 py-4 text-sm text-muted-foreground">
        <Link
          href="/privatlivspolitik"
          className="flex min-h-11 items-center underline-offset-4 hover:underline"
        >
          Privatlivspolitik
        </Link>
      </div>
    </footer>
  );
}
