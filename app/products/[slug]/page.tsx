import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/landing/site-header";
import { Footer } from "@/components/landing/footer";
import { DeliverableIcon } from "@/components/deliverable-icon";
import { deliverableSlugs, getDeliverable } from "@/lib/deliverables";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return deliverableSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDeliverable(slug);
  if (!d) return {};
  return {
    title: d.title,
    description: d.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDeliverable(slug);
  if (!d) notFound();

  const related = d.pairsWith
    .map((s) => getDeliverable(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-6 py-4 text-xs">
            <Link
              href="/#deliverables"
              className="font-mono uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            >
              ← All deliverables
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {d.number} · {d.format}
                </span>
              </div>
              <h1 className="mt-4 text-balance text-3xl leading-[1.12] tracking-tight sm:text-4xl">
                {d.productPageHeadline}
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
                {d.productPageSubhead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/#pricing">See the tiers</Link>
                </Button>
                {d.carouselPdf && (
                  <Button asChild size="lg" variant="outline">
                    <a href={d.carouselPdf} target="_blank" rel="noopener">
                      See a sample (PDF)
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="lg:justify-self-end">
              {d.cover ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-surface lg:w-[360px]">
                  <Image
                    src={d.cover}
                    alt={`${d.title} cover`}
                    fill
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-md border border-border bg-surface text-primary/70 lg:w-[360px]">
                  <DeliverableIcon name={d.icon} className="h-20 w-20" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              About this deliverable
            </p>
            <h2 className="mt-3 text-2xl tracking-tight">{d.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
              {d.productPageBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
              What&apos;s in this package
            </p>
            <h2 className="mt-3 text-2xl tracking-tight">Inside the bundle</h2>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {d.whatsInside.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-4 text-sm leading-relaxed">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pairs with */}
        {related.length > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-5xl px-6 py-16">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                Pairs with
              </p>
              <h2 className="mt-3 text-2xl tracking-tight">Designed to deploy together</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/products/${r.slug}`} className="group block">
                    <Card className="flex h-full bg-card transition-colors group-hover:border-primary/40">
                      <CardContent className="flex w-full items-center gap-4 p-5">
                        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-surface text-primary">
                          <DeliverableIcon name={r.icon} className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                            {r.number} · {r.format}
                          </p>
                          <h3 className="mt-1 text-base">{r.title}</h3>
                        </div>
                        <Badge variant="muted">View</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Closing CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-3xl tracking-tight text-primary-foreground">
              All six deliverables ship in every tier.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/75">
              The difference between Starter, Pro, and Consultant is what you can do with them
              — Loom walkthroughs, editable sources, multi-client white-label use.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="accent">
                <Link href="/#pricing">See the tiers</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

