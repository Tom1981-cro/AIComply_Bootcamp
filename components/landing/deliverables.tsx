import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeliverableIcon } from "@/components/deliverable-icon";
import { DELIVERABLES } from "@/lib/deliverables";

export function Deliverables() {
  return (
    <section id="deliverables" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">03</p>
          <h2 className="mt-3 text-3xl tracking-tight">The six deliverables</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <Link key={d.slug} href={`/products/${d.slug}`} className="group block">
              <Card className="flex h-full flex-col overflow-hidden bg-card transition-colors group-hover:border-primary/40">
                {d.cover ? (
                  <div className="relative aspect-square w-full overflow-hidden bg-surface">
                    <Image
                      src={d.cover}
                      alt={`${d.title} cover`}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-square w-full items-center justify-center bg-surface text-primary/70">
                    <DeliverableIcon name={d.icon} className="h-14 w-14" />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-sm text-accent">{d.number}</span>
                    <Badge variant="muted">{d.format}</Badge>
                  </div>
                  <h3 className="mt-4 text-lg leading-snug">{d.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {d.shortDescription}
                  </p>
                  <span className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-primary group-hover:text-primary-strong">
                    Read more →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
