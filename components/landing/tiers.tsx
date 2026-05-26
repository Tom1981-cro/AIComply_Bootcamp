import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/landing/checkout-button";
import { TIER_ORDER, TIERS, type TierKey } from "@/lib/tiers";
import { formatMoney, cn } from "@/lib/utils";

export function Tiers({ checkoutUrls }: { checkoutUrls: Record<TierKey, string | null> }) {
  return (
    <section id="pricing" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">What&apos;s inside</h2>
          <p className="mt-3 text-muted-foreground">
            [PLACEHOLDER] One line framing the three tiers.
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
                  "flex flex-col bg-background",
                  featured && "border-primary ring-1 ring-primary",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    {featured && <Badge>Most popular</Badge>}
                  </div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight">
                    {formatMoney(tier.price, tier.currency)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3 text-sm">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
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
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prices include VAT where applicable. Sold by Lemon Squeezy, our Merchant of Record.
        </p>
      </div>
    </section>
  );
}
