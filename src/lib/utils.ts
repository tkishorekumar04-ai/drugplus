import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom font-size tokens so they are not dropped next to text-colour classes.
const twMerge = extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: ["display-xl", "display-lg", "display-md"] }] } } });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...opts }).format(new Date(d));
}

/** Digits only, for tel: / wa.me links */
export function digits(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function whatsappLink(number: string, message: string) {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(message)}`;
}

export function telLink(number: string) {
  return `tel:+${digits(number)}`;
}

export function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}
