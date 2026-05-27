const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Is this legal advice?",
    a: "No. These are templates and working documents. They reference the relevant Articles of Regulation (EU) 2024/1689 and are written to be technically accurate, but compliance depends on your specific deployment context. Use them as a starting point and have your DPO, counsel, or a qualified consultant review before relying on them in front of a regulator.",
  },
  {
    q: "My organisation only uses ChatGPT and Copilot — does the AI Act actually apply to us?",
    a: "Yes, in two ways. Article 4 requires you to ensure AI literacy among staff using these tools, in effect from 2 February 2025. Article 26 imposes deployer obligations if any of those tools, in your specific use, fall into the high-risk category — for example, AI used in recruitment screening, employee evaluation, or access to essential services. The system register helps you identify which of your uses, if any, cross that line.",
  },
  {
    q: "When do the obligations start?",
    a: "Article 4 (literacy) and Article 5 (prohibited practices) applied from 2 February 2025. Obligations on general-purpose AI models from 2 August 2025. Article 50 transparency obligations from 2 August 2026. Most high-risk system obligations from 2 August 2026, with the Annex I product-safety category extended to 2 August 2027.",
  },
  {
    q: "We're not in the EU. Does this still apply to us?",
    a: "The Act applies extraterritorially where output is used in the EU. If you have EU customers, EU employees making AI-assisted decisions, or EU users of your AI-enabled product, you are in scope. The templates are jurisdiction-aware on this point.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, within 14 days, provided you have not downloaded all the deliverables. Handled by Lemon Squeezy.",
  },
  {
    q: "Will you update the pack when guidance changes?",
    a: "Yes. Buyers receive updates by email when the AI Office publishes material guidance affecting any of the six documents — for instance, the forthcoming Code of Practice or any delegated acts amending Annexes.",
  },
  {
    q: "Why is the consultant tier €399 and not €999?",
    a: "Because it has to be defensible at that price. €399 reflects what the pack actually is: a strong starting point that a competent consultant adapts to their client. It is not a substitute for the consultant's own judgement, and pricing it as if it were would be dishonest.",
  },
  {
    q: "What format are the source files?",
    a: "Markdown for prose documents, structured YAML for the register schema, plain DOCX/XLSX/PDF for everything else. No proprietary formats, no platform lock-in.",
  },
  {
    q: "Can I see a sample before buying?",
    a: "The free Article 50 disclosure pack is a working sample of the quality and register — same author, same approach, fully usable on its own.",
  },
  {
    q: "Who are you?",
    a: 'See "About the author" above. If that section is not yet filled in, do not buy the paid tiers yet.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">05</p>
        <h2 className="mt-3 text-3xl tracking-tight">Frequently asked questions</h2>
        <div className="mt-10 divide-y divide-border border-t border-border">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium">
                <span className="leading-snug">{item.q}</span>
                <span className="mt-0.5 shrink-0 font-mono text-lg leading-none text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
