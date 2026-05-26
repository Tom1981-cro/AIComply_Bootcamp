/**
 * Design tokens for the EU AI Act SME Compliance Pack storefront.
 *
 * [PLACEHOLDER PALETTE — CONFIRM AGAINST AICOMPLY BRAND]
 * No AIComply design tokens were present in this repo, so this is a calm,
 * neutral, technically-credible palette (lots of slate, one confident blue,
 * a restrained teal accent). Replace the hex values below with the real
 * AIComply tokens once available — they are the single source of truth and
 * are mirrored as CSS custom properties in app/globals.css.
 *
 * Tone goal (per brief): calm, specific, technically credible. No scare-copy
 * colours (no alarm reds as primary), no neon.
 */

export const colors = {
  // Core surfaces
  background: "#FFFFFF",
  surface: "#F8FAFC", // slate-50, section backgrounds
  surfaceMuted: "#F1F5F9", // slate-100, cards / wells

  // Text
  foreground: "#0F172A", // slate-900, primary text / headlines
  muted: "#64748B", // slate-500, secondary text

  // Lines
  border: "#E2E8F0", // slate-200

  // Brand
  primary: "#1D4ED8", // blue-700, primary CTAs + links
  primaryForeground: "#FFFFFF",
  accent: "#0F766E", // teal-700, subtle highlights / badges
  accentForeground: "#FFFFFF",

  // States
  ring: "#1D4ED8",
  destructive: "#B91C1C", // red-700, used sparingly (errors only)
} as const;

export const radii = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
} as const;

export const fonts = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export type ColorToken = keyof typeof colors;
