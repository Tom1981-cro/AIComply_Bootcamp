import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";

const PARA_1 =
  "Article 50 transparency obligations apply from 2 August 2026: if you deploy a chatbot, generate synthetic content, use emotion recognition or biometric categorisation, or produce deepfakes, you must disclose this to the people affected, in specific ways.";
const PARA_2 =
  "The free pack contains the disclosure clauses, a decision tree for which of your AI uses trigger Article 50, and example user-facing notices. It is genuinely useful on its own, and it is the same author and the same standard as the paid pack — so you can judge for yourself before buying.";

export function LeadMagnetSection({ consentText }: { consentText: string }) {
  return (
    <section id="lead-magnet" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">06 — Free</p>
        <h2 className="mt-3 text-3xl tracking-tight">The Article 50 disclosure pack</h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">{PARA_1}</p>
        <p className="mt-3 leading-relaxed text-muted-foreground">{PARA_2}</p>
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <LeadMagnetForm consentText={consentText} />
        </div>
      </div>
    </section>
  );
}
