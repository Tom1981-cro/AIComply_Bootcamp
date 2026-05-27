"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

let initialized = false;

/**
 * Initializes PostHog on the client when NEXT_PUBLIC_POSTHOG_KEY is present.
 * No-ops otherwise. EU Cloud is the default host; set NEXT_PUBLIC_POSTHOG_HOST
 * to point at a self-hosted EU instance.
 *
 * No autocapture / no session recording by default — EU buyer, trust-first.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || initialized) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      autocapture: false,
      capture_pageview: true,
      disable_session_recording: true,
      persistence: "localStorage",
    });
    initialized = true;
  }, []);

  return <>{children}</>;
}

/** Safe client-side capture; no-ops when PostHog isn't initialized. */
export function capture(event: string, properties: Record<string, unknown> = {}) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}
