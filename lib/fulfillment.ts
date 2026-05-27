import type { Order } from "@prisma/client";
import { TIERS } from "@/lib/tiers";
import { createDownloadGrant, downloadUrl } from "@/lib/download";
import { sendEmail } from "@/lib/resend";
import { fulfillmentEmail } from "@/lib/email/templates";
import { appUrl, optionalEnv } from "@/lib/env";

export interface OrderLinks {
  links: { label: string; url: string }[];
  loomUrl?: string;
}

/** Create fresh download grants for every file in the order's tier. */
export async function buildOrderLinks(order: Order): Promise<OrderLinks> {
  const tier = TIERS[order.tier];
  const grants = await Promise.all(
    tier.files.map((f) =>
      createDownloadGrant({
        fileKey: f.fileKey,
        label: f.label,
        tier: order.tier,
        email: order.email,
        orderId: order.id,
      }),
    ),
  );
  const links = grants.map((g, i) => ({ label: tier.files[i].label, url: downloadUrl(g.id) }));
  const loomUrl = tier.includesLoom ? optionalEnv("LOOM_WALKTHROUGH_URL") : undefined;
  return { links, loomUrl };
}

export async function sendFulfillmentEmail(order: Order, data: OrderLinks): Promise<void> {
  const content = fulfillmentEmail({
    tierName: TIERS[order.tier].name,
    links: data.links,
    loomUrl: data.loomUrl,
    orderUrl: `${appUrl()}/orders/${order.id}`,
  });
  await sendEmail({ to: order.email, ...content });
}

/** Full purchase fulfillment: issue grants + send the delivery email. */
export async function fulfillOrder(order: Order): Promise<void> {
  const data = await buildOrderLinks(order);
  await sendFulfillmentEmail(order, data);
}
