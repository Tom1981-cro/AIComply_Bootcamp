import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format minor units (cents) as a localized currency string. */
export function formatMoney(minorUnits: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
  }).format(minorUnits / 100);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}
