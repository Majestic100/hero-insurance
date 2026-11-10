import { ChevronDownIcon } from "lucide-react";

export type FaqItem = { question: string; answer: string };

/** Questions and answers. Native <details>, works without JavaScript. */
export function FaqList({
  items,
  title = "Spørgsmål og svar",
}: {
  items: readonly FaqItem[];
  title?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 divide-y rounded-lg border">
        {items.map(({ question, answer }) => (
          <details key={question} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-medium [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDownIcon
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-4 pb-4 text-muted-foreground">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
