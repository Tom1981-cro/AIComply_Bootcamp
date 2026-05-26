import { optionalEnv } from "@/lib/env";

/**
 * Minimal server-side PostHog capture. No-ops entirely when POSTHOG_KEY is
 * unset, so analytics is fully optional (per the "stub via env" decision).
 * Self-hosted EU instances set POSTHOG_HOST; otherwise EU Cloud is assumed.
 */
export async function captureServer(
  event: string,
  distinctId: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  const key = optionalEnv("POSTHOG_KEY");
  if (!key) return; // analytics disabled

  const host = optionalEnv("POSTHOG_HOST") ?? "https://eu.i.posthog.com";

  try {
    await fetch(`${host.replace(/\/$/, "")}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties: { ...properties, $lib: "aicomply-bootcamp-server" },
        timestamp: new Date().toISOString(),
      }),
      // Don't let analytics latency block fulfillment.
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Swallow analytics errors — never block the business action.
  }
}
