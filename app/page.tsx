import Script from "next/script";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Tiers } from "@/components/landing/tiers";
import { Deliverables } from "@/components/landing/deliverables";
import { Personas } from "@/components/landing/personas";
import { About } from "@/components/landing/about";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { LeadMagnetSection } from "@/components/landing/lead-magnet-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { readContentFile } from "@/lib/content";
import { buildCheckoutUrl, lemonConfigured } from "@/lib/lemon";
import { TIER_ORDER, type TierKey } from "@/lib/tiers";

// Rendered per-request so runtime env (checkout config) and content files are
// always reflected.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [problem, consentText] = await Promise.all([
    readContentFile("landing/problem.md"),
    readContentFile("legal/consent-lead-magnet.md"),
  ]);

  const configured = lemonConfigured();
  const checkoutUrls = Object.fromEntries(
    TIER_ORDER.map((key) => [key, configured ? buildCheckoutUrl(key) : null]),
  ) as Record<TierKey, string | null>;

  return (
    <>
      <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Problem content={problem} />
        <Tiers checkoutUrls={checkoutUrls} />
        <Deliverables />
        <Personas />
        <About />
        <Testimonials />
        <Faq />
        <LeadMagnetSection
          consentText={
            consentText ?? "[PLACEHOLDER] Consent text — see content/legal/consent-lead-magnet.md"
          }
        />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
