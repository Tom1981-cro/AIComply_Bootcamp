import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {"Stop staring at the Official Journal PDF. Start with documents."}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {"Six deliverables, three tiers, one author who will answer your email. Refund within 14 days if it isn't what you needed."}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <a href="#pricing">See the tiers</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
