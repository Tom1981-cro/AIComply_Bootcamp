/**
 * Design tokens for the EU AI Act SME Compliance Pack storefront.
 *
 * Extracted from the Tier-1 executive slide deck so the storefront matches the
 * brand: a warm, editorial palette (cream paper, warm ink, aubergine/plum
 * primary, forest-green and bronze accents) with a serif display face.
 * Source of truth is mirrored as CSS custom properties in app/globals.css.
 *
 * Tone (per brief): calm, specific, technically credible. No scare-copy.
 */

export const colors = {
  // Surfaces
  background: "#FAF9F6", // paper
  surface: "#EFEDE6", // cream band (alternating sections)
  card: "#FFFFFF",

  // Text
  foreground: "#1A1714", // warm near-black ink
  muted: "#716B62", // taupe, secondary text

  // Lines
  border: "#E4DED2", // warm hairline

  // Brand
  primary: "#3A1530", // aubergine / plum
  primaryStrong: "#4C1D3D", // lighter plum (gradients / emphasis)
  primaryForeground: "#FAF9F6",
  secondary: "#2F4A3A", // forest green
  secondaryForeground: "#FAF9F6",
  accent: "#B58754", // bronze / tan
  accentForeground: "#1A1714",

  // States
  ring: "#3A1530",
  destructive: "#9B2C2C", // restrained, errors only
} as const;

export const fonts = {
  serif: "var(--font-fraunces)", // display / headings
  sans: "var(--font-inter)", // body
  mono: "var(--font-jetbrains)", // labels / eyebrows
} as const;

export type ColorToken = keyof typeof colors;
