import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkGrant } from "@/lib/download";
import { getPresignedDownloadUrl } from "@/lib/r2";
import { captureServer } from "@/lib/posthog";

export const runtime = "nodejs";

function clientIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip");
}

function problem(message: string, status: number) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family:system-ui;padding:48px;max-width:480px;margin:auto"><h1 style="font-size:18px">Download unavailable</h1><p style="color:#475569">${message}</p><p style="color:#475569">You can request a fresh link from your order page or the email you received.</p></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request, { params }: { params: Promise<{ grant: string }> }) {
  const { grant: grantId } = await params;
  const ip = clientIp(req);

  const grant = await prisma.downloadGrant.findUnique({ where: { id: grantId } });
  const check = checkGrant(grant, ip);

  if (!check.ok) {
    switch (check.reason) {
      case "not_found":
        return problem("This download link was not found.", 404);
      case "expired":
        return problem("This download link has expired.", 410);
      case "exhausted":
        return problem("This download link has reached its download limit.", 410);
      case "wrong_ip":
        return problem("This download link is bound to a different network.", 403);
    }
  }

  // Atomically consume one download, guarded against the cap, and bind the IP
  // on first use.
  const updated = await prisma.downloadGrant.updateMany({
    where: {
      id: grantId,
      downloadCount: { lt: check.grant.maxDownloads },
      expiresAt: { gt: new Date() },
    },
    data: {
      downloadCount: { increment: 1 },
      ...(check.grant.boundIp || !ip ? {} : { boundIp: ip }),
    },
  });

  if (updated.count === 0) {
    return problem("This download link has reached its download limit.", 410);
  }

  const url = await getPresignedDownloadUrl(check.grant.fileKey, 60);

  await captureServer("download_clicked", check.grant.email, {
    tier: check.grant.tier,
    file: check.grant.fileKey,
  });

  return NextResponse.redirect(url, 302);
}
