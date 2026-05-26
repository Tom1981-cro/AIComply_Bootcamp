const FAQ_ITEMS = Array.from({ length: 10 }, (_, i) => ({
  q: `[PLACEHOLDER] FAQ question ${i + 1}`,
  a: `[PLACEHOLDER] Answer ${i + 1}. Calm, specific, technically credible.`,
}));

export function Faq() {
  return (
    <section id="faq" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-background">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {item.q}
                <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
