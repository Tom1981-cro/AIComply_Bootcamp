import { Button } from "@/components/ui/button";

const EYEBROW = "For SME operations leads and GDPR consultants";
const HEADLINE =
  "The EU AI Act paperwork your SME actually has to produce — drafted, structured, and ready to adapt";
const SUBHEAD =
  "Six deliverables covering Articles 4, 26, and 50 obligations: AI literacy training, an AI system register, an acceptable use policy, an Annex IV-lite technical file, a 90-day implementation roadmap, and a vendor due diligence questionnaire. Written for organisations that need to show their working, not buy peace of mind.";

export function Hero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-accent" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
            {EYEBROW}
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-[3.5rem]">
          {HEADLINE}
        </h1>
        <p className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          {SUBHEAD}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
