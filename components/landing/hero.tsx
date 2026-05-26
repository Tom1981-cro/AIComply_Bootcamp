import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <Badge variant="muted" className="mb-6">
          [PLACEHOLDER] eyebrow — e.g. &ldquo;For SMEs &amp; consultants&rdquo;
        </Badge>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          [PLACEHOLDER] Headline — calm, specific, reference an actual Article number
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          [PLACEHOLDER] Subhead — one or two sentences. Technically credible, no
          scare-copy. Who it&apos;s for and what they walk away with.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="#pricing">See what&apos;s inside — €49</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#lead-magnet">Get the free Article 50 disclosure pack</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
