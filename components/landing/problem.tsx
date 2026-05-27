export function Problem({ content }: { content: string | null }) {
  const paragraphs = (content ?? "[PLACEHOLDER] content/landing/problem.md not found.").split(
    /\n\s*\n/,
  );
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">01</p>
        <h2 className="mt-3 text-3xl tracking-tight">The problem</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p.trim()}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
