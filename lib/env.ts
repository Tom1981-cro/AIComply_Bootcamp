/**
 * Centralized, typed access to environment variables.
 *
 * `requireEnv` throws at call time (not import time) so that build/render of
 * pages that don't need a given integration won't crash when its vars are
 * absent. Optional getters return undefined and let callers no-op gracefully
 * (e.g. PostHog is stubbed when unset).
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

/** Public base URL of the storefront, e.g. https://hub.ai-comply.ie */
export function appUrl(): string {
  return optionalEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}
