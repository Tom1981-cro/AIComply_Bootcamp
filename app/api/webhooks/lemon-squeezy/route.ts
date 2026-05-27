import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/lemon";
import { tierForVariant, type TierKey } from "@/lib/tiers";
import { fulfillOrder } from "@/lib/fulfillment";
import { captureServer } from "@/lib/posthog";

export const runtime = "nodejs";

// Minimal shape of the bits of the Lemon Squeezy payload we use.
interface LemonPayload {
  meta?: {
    event_name?: string;
    custom_data?: Record<string, string>;
  };
  data?: {
    id?: string;
    attributes?: {
      user_email?: string;
      currency?: string;
      total?: number;
      tax?: number;
      // country is not reliably present on the order object; best-effort.
      tax_country?: string;
      first_order_item?: { variant_id?: number | string };
    };
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");
  const headerEventName = req.headers.get("x-event-name");

  // Verify signature. Missing secret is a hard configuration error.
  let signatureValid = false;
  try {
    signatureValid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error("webhook secret misconfigured", err);
    return NextResponse.json(
      { error: "Webhook signing secret not configured." },
      { status: 500 },
    );
  }

  let payload: LemonPayload = {};
  try {
    payload = JSON.parse(rawBody) as LemonPayload;
  } catch {
    // Keep going to record the event, but treat as unparseable.
  }

  const eventName = headerEventName ?? payload.meta?.event_name ?? "unknown";
  const lemonOrderId = payload.data?.id;

  const event = await prisma.webhookEvent.create({
    data: {
      eventName,
      lemonOrderId: lemonOrderId ?? null,
      signatureValid,
      payload: (payload ?? {}) as Prisma.InputJsonValue,
    },
  });

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    if (eventName === "order_created") {
      await handleOrderCreated(payload, event.id);
    } else if (eventName === "subscription_created") {
      // No subscriptions in v1 — acknowledge and log.
      console.info("subscription_created received (no-op in v1)", lemonOrderId);
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });
    } else {
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });
    }
  } catch (err) {
    console.error(`webhook ${eventName} handling failed`, err);
    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: { error: err instanceof Error ? err.message : String(err) },
    });
    // Return 200 so Lemon doesn't retry-storm; the order (if created) is
    // recorded and can be re-fulfilled from /admin.
  }

  return NextResponse.json({ ok: true });
}

async function handleOrderCreated(payload: LemonPayload, eventId: string) {
  const attrs = payload.data?.attributes;
  const lemonOrderId = payload.data?.id;
  const email = attrs?.user_email?.trim().toLowerCase();

  if (!lemonOrderId || !email) {
    throw new Error("order_created missing id or email");
  }

  // Idempotency: skip if we've already processed this order.
  const existing = await prisma.order.findUnique({ where: { lemonOrderId } });
  if (existing) {
    await prisma.webhookEvent.update({ where: { id: eventId }, data: { processed: true } });
    return;
  }

  // Resolve tier: prefer custom_data.tier, fall back to variant mapping.
  const variantId = attrs?.first_order_item?.variant_id;
  const customTier = payload.meta?.custom_data?.tier as TierKey | undefined;
  const tier =
    (customTier && ["STARTER", "PRO", "CONSULTANT"].includes(customTier) ? customTier : undefined) ??
    (variantId != null ? tierForVariant(String(variantId)) : undefined);

  if (!tier) {
    throw new Error(`Could not resolve tier for order ${lemonOrderId}`);
  }

  const order = await prisma.order.create({
    data: {
      lemonOrderId,
      email,
      tier,
      amount: attrs?.total ?? 0,
      currency: attrs?.currency ?? "EUR",
      country: attrs?.tax_country ?? null,
      vatAmount: attrs?.tax ?? 0,
    },
  });

  await fulfillOrder(order);

  await captureServer("purchase_completed", email, {
    tier: order.tier,
    price: order.amount,
    country: order.country,
  });

  await prisma.webhookEvent.update({ where: { id: eventId }, data: { processed: true } });
}
