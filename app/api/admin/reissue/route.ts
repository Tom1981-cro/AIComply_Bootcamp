import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fulfillOrder } from "@/lib/fulfillment";
import { appUrl } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const orderId = form.get("orderId");

  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "orderId required." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Admin re-issue does not count against the customer self-service cap.
  await fulfillOrder(order);

  return NextResponse.redirect(`${appUrl()}/admin?reissued=${order.id}`, 303);
}
