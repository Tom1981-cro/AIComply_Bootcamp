import { LeadMagnetForm } from "@/components/landing/lead-magnet-form";

const PARA_1 =
  "Article 50 transparency obligations apply from 2 August 2026: if you deploy a chatbot, generate synthetic content, use emotion recognition or biometric categorisation, or produce deepfakes, you must disclose this to the people affected, in specific ways.";
const PARA_2 =
  "The free pack contains the disclosure clauses, a decision tree for which of your AI uses trigger Article 50, and example user-facing notices. It is genuinely useful on its own, and it is the same author and the same standard as the paid pack — so you can judge for yourself before buying.";

export function LeadMagnetSection({ consentText }: { consentText: string }) {
  return (
    <section id="lead-magnet" className="border-b border-border">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Free: the Article 50 disclosure pack
        </h2>
        <p className="mt-4 text-muted-foreground">{PARA_1}</p>
        <p className="mt-3 text-muted-foreground">{PARA_2}</p>
        <div className="mt-8 text-left">
          <LeadMagnetForm consentText={consentText} />
        </div>
      </div>
    </section>
  );
}
