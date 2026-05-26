import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";

export function LeadMagnetSection({ consentText }: { consentText: string }) {
  return (
    <section id="lead-magnet" className="border-b border-border">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Free: the Article 50 disclosure pack
        </h2>
        <p className="mt-3 text-muted-foreground">
          [PLACEHOLDER] One or two sentences on what the free pack contains and
          why it&apos;s useful. Calm and specific.
        </p>
        <div className="mt-8 text-left">
          <LeadMagnetForm consentText={consentText} />
        </div>
      </div>
    </section>
  );
}
