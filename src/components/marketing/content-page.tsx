import type { ReactNode } from "react";

/**
 * Layout for text pages (legal pages, about, contact): a title, an optional
 * "last updated" line and readable body text. Style plain HTML elements
 * here instead of per page.
 */
export function ContentPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: ReactNode;
  /** Danish date, e.g. "10. november 2026". */
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {updated && (
        <p className="mt-2 text-sm text-muted-foreground">Senest opdateret {updated}</p>
      )}
      {intro && <div className="mt-4 text-lg text-muted-foreground">{intro}</div>}
      <div className="mt-8 space-y-4 leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:pt-2 [&_h3]:font-semibold [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_table]:w-full [&_table]:text-sm [&_td]:border-t [&_td]:py-2 [&_td]:pr-3 [&_td]:align-top [&_th]:pb-2 [&_th]:pr-3 [&_th]:text-left [&_th]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </main>
  );
}
