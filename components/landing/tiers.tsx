import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/landing/checkout-button";
import { TIER_ORDER, TIERS, type TierKey } from "@/lib/tiers";
import { formatMoney, cn } from "@/lib/utils";

export function Tiers({ checkoutUrls }: { checkoutUrls: Record<TierKey, string | null> }) {
  return (
    <section id="pricing" className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">02</p>
          <h2 className="mt-3 text-3xl tracking-tight">What&apos;s inside</h2>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            {"One pack, three tiers. Same six core documents in every tier; the difference is what you can do with them."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIER_ORDER.map((key) => {
            const tier = TIERS[key];
            const featured = key === "PRO";
            return (
              <Card
                key={key}
                className={cn(
                  "flex flex-col bg-card",
                  featured && "border-primary ring-1 ring-primary",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {tier.name}
                    </h3>
                    {featured && <Badge variant="solid">Most popular</Badge>}
                  </div>
                  <div className="mt-3 font-serif text-4xl font-semibold tracking-tight">
                    {formatMoney(tier.price, tier.currency)}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {tier.tagline}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="h-px w-full bg-border" />
                  <ul className="mt-5 flex-1 space-y-3 text-sm">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <CheckoutButton
                      checkoutUrl={checkoutUrls[key]}
                      tier={key}
                      price={tier.price}
                      label={`Get ${tier.name} — ${formatMoney(tier.price, tier.currency)}`}
                      variant={featured ? "default" : "outline"}
                      size="lg"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
          Prices include VAT where applicable · Sold by Lemon Squeezy, our Merchant of Record
        </p>
      </div>
    </section>
  );
}
