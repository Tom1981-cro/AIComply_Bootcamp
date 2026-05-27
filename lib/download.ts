import type { DownloadGrant, Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/env";

export const GRANT_TTL_MS = 60 * 60 * 1000; // 1 hour
export const MAX_DOWNLOADS = 5;

interface CreateGrantInput {
  fileKey: string;
  label: string;
  email: string;
  tier?: Tier | null;
  orderId?: string | null;
  subscriberId?: string | null;
}

export async function createDownloadGrant(input: CreateGrantInput): Promise<DownloadGrant> {
  return prisma.downloadGrant.create({
    data: {
      fileKey: input.fileKey,
      label: input.label,
      tier: input.tier ?? null,
      email: input.email,
      orderId: input.orderId ?? null,
      subscriberId: input.subscriberId ?? null,
      maxDownloads: MAX_DOWNLOADS,
      expiresAt: new Date(Date.now() + GRANT_TTL_MS),
    },
  });
}

/** Customer-facing link that routes through our gated download endpoint. */
export function downloadUrl(grantId: string): string {
  return `${appUrl()}/api/download/${grantId}`;
}

export type GrantCheck =
  | { ok: true; grant: DownloadGrant }
  | { ok: false; reason: "not_found" | "expired" | "exhausted" | "wrong_ip" };

/**
 * Validate a grant for a given requester IP without mutating it. The route
 * increments the counter and binds the IP atomically after this passes.
 */
export function checkGrant(
  grant: DownloadGrant | null,
  requestIp: string | null,
): GrantCheck {
  if (!grant) return { ok: false, reason: "not_found" };
  if (grant.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };
  if (grant.downloadCount >= grant.maxDownloads) return { ok: false, reason: "exhausted" };
  if (grant.boundIp && requestIp && grant.boundIp !== requestIp) {
    return { ok: false, reason: "wrong_ip" };
  }
  return { ok: true, grant };
}
