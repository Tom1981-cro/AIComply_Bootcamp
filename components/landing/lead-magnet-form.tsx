"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { capture } from "@/components/posthog-provider";

type Status = "idle" | "submitting" | "success" | "error";

export function LeadMagnetForm({ consentText }: { consentText: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage("Please tick the consent box to continue.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      // Remember email so checkout can prefill it.
      try {
        window.localStorage.setItem("toolkit_email", email);
      } catch {
        /* localStorage may be unavailable */
      }
      capture("lead_magnet_submitted", { source: "toolkit-lead-magnet" });
      setStatus("success");
      setMessage("Almost there — check your inbox to confirm your email.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="you@company.eu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          className="sm:flex-1"
        />
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send me the pack"}
        </Button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
          aria-label="GDPR consent"
        />
        <span>{consentText}</span>
      </label>
      {status === "error" && <p className="text-xs text-destructive">{message}</p>}
    </form>
  );
}
