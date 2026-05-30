/**
 * Design tokens for the EU AI Act SME Compliance Pack storefront.
 *
 * Source of truth for the brand palette is the marketing-kit README that ships
 * with the carousel/cover assets. These values match the brand reference table
 * (aubergine, gold, cream, body grey) so the storefront is visually aligned
 * with the cover images, carousels, and one-pagers.
 *
 * Source of truth is mirrored as CSS custom properties in app/globals.css.
 */

export const colors = {
  // Surfaces
  background: "#FAF6F0", // cream paper (brand)
  surface: "#F1ECE0", // band — slightly darker cream
  card: "#FFFFFF",

  // Text
  foreground: "#4A4A4A", // body grey (brand)
  ink: "#2D1736", // header / headlines (brand, darker plum tone)
  muted: "#8A7E7E", // muted small-caps (brand)

  // Lines
  border: "#E5DCCB", // warm hairline

  // Brand
  primary: "#3E1F47", // aubergine (brand)
  primaryStrong: "#2D1736", // darker header-bar tone (brand)
  primaryForeground: "#FAF6F0",
  accent: "#B89968", // gold (brand)
  accentForeground: "#2D1736",
  secondary: "#2F4A3A", // forest green (deck — used sparingly)
  secondaryForeground: "#FAF6F0",

  // States
  ring: "#3E1F47",
  destructive: "#9B2C2C", // restrained, errors only
} as const;

export const fonts = {
  serif: "var(--font-fraunces)", // display / headings
  sans: "var(--font-inter)", // body
  mono: "var(--font-jetbrains)", // labels / eyebrows
} as const;

export type ColorToken = keyof typeof colors;
