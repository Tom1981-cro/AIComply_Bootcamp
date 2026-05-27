import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl tracking-tight text-primary-foreground sm:text-4xl">
          {"Stop staring at the Official Journal PDF. Start with documents."}
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-primary-foreground/75">
          {"Six deliverables, three tiers, one author who will answer your email. Refund within 14 days if it isn't what you needed."}
        </p>
        <div className="mt-9">
          <Button asChild size="lg" variant="accent">
            <a href="#pricing">See the tiers</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
