"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "submitting" | "success" | "error";

export function RequestLinkForm({ orderId }: { orderId?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/orders/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(
        "If that email matches a purchase, we've sent a link to access your downloads.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm">{message}</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        required
        placeholder="The email you purchased with"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Purchase email"
        className="sm:flex-1"
      />
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Email me a link"}
      </Button>
      {status === "error" && <p className="text-xs text-destructive sm:hidden">{message}</p>}
    </form>
  );
}
