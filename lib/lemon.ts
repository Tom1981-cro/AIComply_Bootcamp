import crypto from "node:crypto";
import { optionalEnv, requireEnv } from "@/lib/env";
import { TIERS, type TierKey } from "@/lib/tiers";

/**
 * Verify a Lemon Squeezy webhook signature. Lemon signs the raw request body
 * with HMAC-SHA256 using the store's webhook signing secret and sends the hex
 * digest in the `X-Signature` header.
 *
 * Throws if the signing secret is not configured (we never want to silently
 * accept unverified webhooks), and returns false on mismatch.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = requireEnv("LEMON_WEBHOOK_SECRET");
  if (!signatureHeader) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signatureHeader, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Build a Lemon Squeezy hosted-checkout URL for a tier, configured for the
 * overlay (embed=1). `custom_data.tier` is passed so the webhook can route
 * fulfillment. Email can be prefilled client-side by appending
 * `checkout[email]`. Built server-side because variant ids are server secrets.
 */
export function buildCheckoutUrl(tier: TierKey, email?: string): string {
  const storeUrl = requireEnv("LEMON_STORE_URL").replace(/\/$/, "");
  const variantId = requireEnv(TIERS[tier].variantEnv);

  const params = new URLSearchParams();
  params.set("embed", "1");
  params.set("media", "0");
  params.set("logo", "0");
  params.set("checkout[custom][tier]", tier);
  if (email) params.set("checkout[email]", email);

  return `${storeUrl}/buy/${variantId}?${params.toString()}`;
}

/** True when all three variant ids + the store URL are configured. */
export function lemonConfigured(): boolean {
  return Boolean(
    optionalEnv("LEMON_STORE_URL") &&
      optionalEnv("LEMON_VARIANT_STARTER") &&
      optionalEnv("LEMON_VARIANT_PRO") &&
      optionalEnv("LEMON_VARIANT_CONSULTANT"),
  );
}
