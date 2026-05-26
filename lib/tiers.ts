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
    tagline: "[PLACEHOLDER] One-line tagline for the Starter tier.",
    bullets: [
      "[PLACEHOLDER] All 6 core deliverables",
      "[PLACEHOLDER] DOCX / XLSX / PDF formats",
      "[PLACEHOLDER] Single-organisation use",
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
    tagline: "[PLACEHOLDER] One-line tagline for the Pro tier.",
    bullets: [
      "[PLACEHOLDER] Everything in Starter",
      "[PLACEHOLDER] Loom walkthrough",
      "[PLACEHOLDER] Editable source files",
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
    tagline: "[PLACEHOLDER] One-line tagline for the Consultant tier.",
    bullets: [
      "[PLACEHOLDER] Everything in Pro",
      "[PLACEHOLDER] White-label rights",
      "[PLACEHOLDER] Multi-client use",
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
