import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { confirmSubscriptionEmail } from "@/lib/email/templates";
import { appUrl } from "@/lib/env";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(320),
  consent: z.literal(true),
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
    return NextResponse.json(
      { error: "A valid email and consent are required." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  const existing = await prisma.leadMagnetSubscriber.findUnique({ where: { email } });

  // Already confirmed — nothing to do, respond success (don't leak state).
  if (existing?.confirmed) {
    return NextResponse.json({ ok: true });
  }

  const confirmToken = crypto.randomBytes(32).toString("hex");

  await prisma.leadMagnetSubscriber.upsert({
    where: { email },
    create: { email, confirmToken },
    update: { confirmToken },
  });

  const confirmUrl = `${appUrl()}/lead-magnet/confirm?token=${confirmToken}`;
  const content = confirmSubscriptionEmail(confirmUrl);

  try {
    await sendEmail({ to: email, ...content });
  } catch (err) {
    console.error("lead-magnet confirm email failed", err);
    return NextResponse.json(
      { error: "Could not send the confirmation email. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
