import { Button } from "@/components/ui/button";

// Placeholder homepage for module 0. It only proves that Next.js, Tailwind
// and shadcn/ui are wired up. The real entry flow is built in module 2.
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12 sm:max-w-lg">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sammenlign forsikringer
        </h1>
        <p className="text-muted-foreground">
          Få tilbud på bil-, indbo- og husforsikring ét sted.
        </p>
      </div>
      <Button size="lg" className="w-full sm:w-auto">
        Kom i gang
      </Button>
    </main>
  );
}
