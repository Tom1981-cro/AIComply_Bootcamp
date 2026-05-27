/**
 * Transactional email templates (plain-text + HTML). No tracking pixels.
 * Copy is intentionally plain and neutral; [PLACEHOLDER] markers indicate
 * where the human may want to adjust wording or support details.
 */

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const SUPPORT_LINE = "[PLACEHOLDER: support contact, e.g. toolkit@aicomply.com]";

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;">
        <h1 style="font-size:18px;margin:0 0 16px;color:#0f172a;">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="font-size:12px;color:#64748b;margin:16px 4px 0;">
        The EU AI Act SME Compliance Pack · ${SUPPORT_LINE}
      </p>
    </div>
  </body>
</html>`;
}

function button(label: string, url: string): string {
  return `<p style="margin:24px 0;">
    <a href="${url}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">${label}</a>
  </p>`;
}

export function confirmSubscriptionEmail(confirmUrl: string): EmailContent {
  return {
    subject: "Confirm your email to get the Article 50 disclosure pack",
    html: layout(
      "One quick step",
      `<p style="font-size:14px;line-height:1.6;">Please confirm your email address to receive the free Article 50 disclosure pack and occasional updates about the EU AI Act for SMEs.</p>
       ${button("Confirm my email", confirmUrl)}
       <p style="font-size:12px;color:#64748b;">If you didn't request this, you can safely ignore this email — no list entry is created until you confirm.</p>`,
    ),
    text: `Confirm your email to get the Article 50 disclosure pack.

Please confirm your email address to receive the free Article 50 disclosure pack:
${confirmUrl}

If you didn't request this, you can ignore this email.`,
  };
}

export function leadMagnetDeliveryEmail(downloadUrl: string): EmailContent {
  return {
    subject: "Your Article 50 disclosure pack",
    html: layout(
      "Here's your download",
      `<p style="font-size:14px;line-height:1.6;">Thanks for confirming. Your Article 50 disclosure pack is ready.</p>
       ${button("Download the pack", downloadUrl)}
       <p style="font-size:12px;color:#64748b;">This link is valid for 1 hour and up to 5 downloads. You can request a fresh link any time.</p>`,
    ),
    text: `Your Article 50 disclosure pack

Thanks for confirming. Download your pack here (valid for 1 hour, up to 5 downloads):
${downloadUrl}`,
  };
}

interface FulfillmentArgs {
  tierName: string;
  links: { label: string; url: string }[];
  loomUrl?: string;
  orderUrl: string;
}

export function fulfillmentEmail({ tierName, links, loomUrl, orderUrl }: FulfillmentArgs): EmailContent {
  const linksHtml = links
    .map((l) => `<li style="margin:8px 0;"><a href="${l.url}" style="color:#1d4ed8;">${l.label}</a></li>`)
    .join("");
  const loomHtml = loomUrl
    ? `<p style="font-size:14px;line-height:1.6;margin-top:16px;">Walkthrough video: <a href="${loomUrl}" style="color:#1d4ed8;">${loomUrl}</a></p>`
    : "";

  const linksText = links.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  const loomText = loomUrl ? `\n\nWalkthrough video: ${loomUrl}` : "";

  return {
    subject: `Your ${tierName} download links`,
    html: layout(
      `Thank you — your ${tierName} pack is ready`,
      `<p style="font-size:14px;line-height:1.6;">Your downloads (each link is valid for 1 hour and up to 5 downloads):</p>
       <ul style="padding-left:18px;font-size:14px;">${linksHtml}</ul>
       ${loomHtml}
       <p style="font-size:12px;color:#64748b;margin-top:24px;">Links expired? Re-issue fresh ones from your order page:</p>
       ${button("Manage my downloads", orderUrl)}`,
    ),
    text: `Thank you — your ${tierName} pack is ready

Your downloads (each link valid for 1 hour, up to 5 downloads):
${linksText}${loomText}

Links expired? Re-issue fresh ones from your order page:
${orderUrl}`,
  };
}

export function magicLinkEmail(url: string): EmailContent {
  return {
    subject: "Your download link",
    html: layout(
      "Access your downloads",
      `<p style="font-size:14px;line-height:1.6;">Click below to view and re-issue your download links. This link expires in 30 minutes.</p>
       ${button("View my downloads", url)}
       <p style="font-size:12px;color:#64748b;">If you didn't request this, you can ignore this email.</p>`,
    ),
    text: `Access your downloads

Click to view and re-issue your download links (expires in 30 minutes):
${url}`,
  };
}
