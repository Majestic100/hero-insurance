import { ClipboardListIcon, MousePointerClickIcon, PhoneCallIcon } from "lucide-react";

const STEPS = [
  {
    icon: MousePointerClickIcon,
    title: "Vælg forsikringer",
    text: "Vælg de forsikringer, du vil have tilbud på. Du kan vælge flere på én gang.",
  },
  {
    icon: ClipboardListIcon,
    title: "Svar på få spørgsmål",
    text: "Én formular for det hele. Vi udfylder meget af det for dig ud fra din adresse og nummerplade.",
  },
  {
    icon: PhoneCallIcon,
    title: "Modtag tilbud",
    text: "Forsikringsselskaberne kontakter dig med et tilbud. Du vælger selv, om du vil tage imod det.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        Sådan virker det
      </h2>
      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="flex gap-4 sm:flex-col">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon aria-hidden className="size-5" />
            </span>
            <div className="space-y-1">
              <h3 className="font-semibold">
                {index + 1}. {title}
              </h3>
              <p className="text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
