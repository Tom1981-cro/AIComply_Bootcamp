import type { Tier } from "@prisma/client";

export type TierKey = Tier; // "STARTER" | "PRO" | "CONSULTANT"

export interface DeliverableFile {
  /** R2 object key (under the configured bucket). */
  fileKey: string;
  /** Human label used in emails and the re-download UI. */
  label: string;
}

export interface TierConfig {
  key: TierKey;
  name: string;
  /** Price in minor units (cents). */
  price: number;
  currency: string;
  /** env var holding the Lemon Squeezy variant id for this tier. */
  variantEnv: string;
  /** Files delivered on purchase. */
  files: DeliverableFile[];
  /** Whether to include the Loom walkthrough URL (LOOM_WALKTHROUGH_URL). */
  includesLoom: boolean;
  // ---- marketing (placeholder copy) ----
  tagline: string;
  bullets: string[];
}

export const TIERS: Record<TierKey, TierConfig> = {
  STARTER: {
    key: "STARTER",
    name: "Starter",
    price: 4900,
    currency: "EUR",
    variantEnv: "LEMON_VARIANT_STARTER",
    files: [{ fileKey: "files/toolkit-starter.zip", label: "Starter toolkit (all 6 deliverables)" }],
    includesLoom: false,
    tagline: "For one organisation putting its own house in order.",
    bullets: [
      "All six core deliverables",
      "DOCX, XLSX, and PDF formats",
      "Single-organisation use",
    ],
  },
  PRO: {
    key: "PRO",
    name: "Pro",
    price: 14900,
    currency: "EUR",
    variantEnv: "LEMON_VARIANT_PRO",
    files: [{ fileKey: "files/toolkit-pro.zip", label: "Pro toolkit (all 6 deliverables)" }],
    includesLoom: true,
    tagline: "For the ops lead who wants to be walked through it once and shown why each clause is there.",
    bullets: [
      "Everything in Starter",
      "A 40-minute Loom walkthrough of each document, clause by clause, with the Article references",
      "Editable source files (Markdown + structured templates) so you can regenerate variants",
    ],
  },
  CONSULTANT: {
    key: "CONSULTANT",
    name: "Consultant",
    price: 39900,
    currency: "EUR",
    variantEnv: "LEMON_VARIANT_CONSULTANT",
    files: [
      { fileKey: "files/toolkit-consultant.zip", label: "Consultant toolkit (all 6 deliverables)" },
      { fileKey: "files/white-label-license.pdf", label: "White-label license" },
    ],
    includesLoom: true,
    tagline: "For GDPR and privacy consultants delivering AI Act readiness to their own client base.",
    bullets: [
      "Everything in Pro",
      "White-label rights: remove our branding, add yours, deliver as your own work product",
      "Multi-client use across your engagements",
    ],
  },
};

export const TIER_ORDER: TierKey[] = ["STARTER", "PRO", "CONSULTANT"];

export function getTier(key: string): TierConfig | undefined {
  return TIERS[key as TierKey];
}

/** Map a Lemon Squeezy variant id back to a tier using env config. */
export function tierForVariant(variantId: string): TierKey | undefined {
  for (const key of TIER_ORDER) {
    const envVal = process.env[TIERS[key].variantEnv];
    if (envVal && envVal === variantId) return key;
  }
  return undefined;
}
