import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-4">
        <Link
          href="/"
          className="flex min-h-11 items-center font-semibold tracking-tight"
        >
          Sammenlign forsikringer
        </Link>
      </div>
    </header>
  );
}
