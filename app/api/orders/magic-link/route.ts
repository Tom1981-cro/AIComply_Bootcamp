import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createMagicLink, magicLinkUrl } from "@/lib/magic-link";
import { sendEmail } from "@/lib/resend";
import { magicLinkEmail } from "@/lib/email/templates";
import { captureServer } from "@/lib/posthog";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(320),
  orderId: z.string().min(1).max(64).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const { orderId } = parsed.data;

  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId } })
    : await prisma.order.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });

  // Only act if the email matches the order. Always respond success either way
  // so we don't disclose whether an order/email exists.
  if (order && order.email === email) {
    const token = await createMagicLink(order);
    try {
      await sendEmail({ to: email, ...magicLinkEmail(magicLinkUrl(order.id, token)) });
    } catch (err) {
      console.error("magic link email failed", err);
      return NextResponse.json({ error: "Could not send the email. Try again later." }, { status: 502 });
    }
    await captureServer("magic_link_requested", email, { order_id: order.id });
  }

  return NextResponse.json({ ok: true });
}
