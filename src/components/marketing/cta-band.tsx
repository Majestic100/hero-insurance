import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Closing call to action on marketing pages. */
export function CtaBand({
  title,
  text,
  href = "/tilbud",
  label = "Få tilbud",
}: {
  title: string;
  text: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <p className="opacity-90">{text}</p>
        </div>
        <Button asChild size="lg" variant="secondary" className="h-12 text-base sm:px-8">
          <Link href={href}>
            {label}
            <ArrowRightIcon aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
