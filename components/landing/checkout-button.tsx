"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { capture } from "@/components/posthog-provider";

interface CheckoutButtonProps extends ButtonProps {
  /** Server-built Lemon Squeezy overlay URL, or null if not configured. */
  checkoutUrl: string | null;
  tier: string;
  price: number; // minor units
  label: string;
}

declare global {
  interface Window {
    LemonSqueezy?: { Url: { Open: (url: string) => void } };
    createLemonSqueezy?: () => void;
  }
}

export function CheckoutButton({
  checkoutUrl,
  tier,
  price,
  label,
  ...buttonProps
}: CheckoutButtonProps) {
  const [opening, setOpening] = useState(false);

  function onClick() {
    if (!checkoutUrl) return;
    capture("checkout_initiated", { tier, price });

    // Prefill email if we captured it from the lead-magnet form.
    let url = checkoutUrl;
    try {
      const stored = window.localStorage.getItem("toolkit_email");
      if (stored && !url.includes("checkout%5Bemail%5D") && !url.includes("checkout[email]")) {
        url += `&checkout[email]=${encodeURIComponent(stored)}`;
      }
    } catch {
      /* ignore */
    }

    setOpening(true);
    try {
      window.createLemonSqueezy?.();
      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(url);
      } else {
        // Fallback: open hosted checkout in a new tab if the overlay SDK
        // hasn't loaded yet.
        window.open(url, "_blank", "noopener");
      }
    } finally {
      setOpening(false);
    }
  }

  if (!checkoutUrl) {
    return (
      <Button {...buttonProps} disabled title="Checkout not configured">
        {label}
      </Button>
    );
  }

  return (
    <Button {...buttonProps} onClick={onClick} disabled={opening}>
      {label}
    </Button>
  );
}
