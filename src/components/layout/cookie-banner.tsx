"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "dp_consent";
export const CONSENT_EVENT = "dp:consent";

export function readConsent(): "all" | "essential" | null {
  try {
    return (localStorage.getItem(KEY) as "all" | "essential" | null) ?? null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(readConsent() === null), []);
  if (!show) return null;

  const choose = (v: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setShow(false);
  };

  return (
    <div role="region" aria-label="Cookie consent" className="fixed inset-x-3 bottom-[4.5rem] z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-lift lg:bottom-6 lg:left-6 lg:right-auto lg:mx-0">
      <p className="text-sm leading-relaxed text-ink-muted">
        We use essential cookies to run this site and, with your permission, analytics cookies to understand how it is used and improve our service.{" "}
        <Link href="/cookie-policy" className="font-semibold text-brand-600 underline-offset-2 hover:underline">Cookie Policy</Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => choose("all")}>Accept all</Button>
        <Button size="sm" variant="outline" onClick={() => choose("essential")}>Essential only</Button>
      </div>
    </div>
  );
}
