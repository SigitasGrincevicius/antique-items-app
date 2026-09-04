import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { ApiError } from "../types";

const eurFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isFinite(num) ? eurFormatter.format(num) : "—";
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelative(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return formatDate(date);
}

/** Describes an item's age in a human-friendly way ("18th century", "Circa 1890"). */
export function describeEra(year: number): string {
  const century = Math.floor((year - 1) / 100) + 1;
  const suffix =
    century % 10 === 1 && century !== 11
      ? "st"
      : century % 10 === 2 && century !== 12
        ? "nd"
        : century % 10 === 3 && century !== 13
          ? "rd"
          : "th";
  return `${century}${suffix} century`;
}

/** Deterministic hue (0-359) per category so items of the same type look related. */
export function categoryHue(name: string | undefined): number {
  if (!name) return 36;
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return hash;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Extracts a user-friendly message from an RTK Query error. */
export function getErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if ("status" in error) {
    if (error.status === "FETCH_ERROR") return "Cannot reach the server. Is the API running?";
    if (error.status === "TIMEOUT_ERROR") return "The request timed out.";
    if (error.status === "PARSING_ERROR") return "Unexpected response from the server.";

    const data = error.data as Partial<ApiError> | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(". ") : data.message;
    }
    if (error.status === 401) return "You need to sign in to do that.";
    if (error.status === 403) return "You don't have permission to do that.";
    if (error.status === 404) return "Not found.";
    return fallback;
  }

  return error.message ?? fallback;
}
