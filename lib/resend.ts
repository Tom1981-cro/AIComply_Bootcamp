import { Resend } from "resend";
import { optionalEnv, requireEnv } from "@/lib/env";

let cached: Resend | undefined;

function client(): Resend {
  if (!cached) cached = new Resend(requireEnv("RESEND_API_KEY"));
  return cached;
}

/** Default sender. All toolkit mail comes from toolkit@aicomply.com. */
function from(): string {
  return optionalEnv("RESEND_FROM") ?? "AIComply Toolkit <toolkit@aicomply.com>";
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  const { error } = await client().emails.send({
    from: from(),
    to,
    subject,
    html,
    text,
    // No open/click tracking — EU buyer, trust-first (no tracking pixels).
  });
  if (error) {
    throw new Error(`Resend send failed: ${error.message ?? JSON.stringify(error)}`);
  }
}

/**
 * Add a confirmed subscriber to the "ai-act-sme" Resend Audience. No-ops if
 * RESEND_AUDIENCE_ID is not configured. Resend contacts don't support
 * arbitrary tags via the API, so the `source:toolkit-lead-magnet` tag is
 * tracked in our own DB (LeadMagnetSubscriber.tag).
 */
export async function addToAudience(email: string): Promise<string | undefined> {
  const audienceId = optionalEnv("RESEND_AUDIENCE_ID");
  if (!audienceId) return undefined;

  const { data, error } = await client().contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  });
  if (error) {
    throw new Error(`Resend audience add failed: ${error.message ?? JSON.stringify(error)}`);
  }
  return data?.id;
}
