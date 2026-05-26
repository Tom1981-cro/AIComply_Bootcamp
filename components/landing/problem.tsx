export function Problem({ content }: { content: string | null }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">The problem</h2>
        <div className="mt-4 whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
          {content ?? "[PLACEHOLDER] content/landing/problem.md not found."}
        </div>
      </div>
    </section>
  );
}
