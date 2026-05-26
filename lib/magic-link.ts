import crypto from "node:crypto";
import type { Order } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/env";

export const MAGIC_LINK_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function createMagicLink(order: Order): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.magicLink.create({
    data: {
      token,
      email: order.email,
      orderId: order.id,
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS),
    },
  });
  return token;
}

export function magicLinkUrl(orderId: string, token: string): string {
  return `${appUrl()}/orders/${orderId}?token=${token}`;
}

/** Validate a magic-link token for an order and consume it. */
export async function consumeMagicLink(orderId: string, token: string): Promise<boolean> {
  const link = await prisma.magicLink.findUnique({ where: { token } });
  if (!link || link.orderId !== orderId) return false;
  if (link.usedAt) return false;
  if (link.expiresAt.getTime() < Date.now()) return false;

  await prisma.magicLink.update({
    where: { id: link.id },
    data: { usedAt: new Date() },
  });
  return true;
}
