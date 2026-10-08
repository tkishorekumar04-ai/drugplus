"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const turnstileOn = Boolean(SITE_KEY);

/** Cloudflare Turnstile widget. Renders nothing when no site key is configured. */
export function Turnstile({ onToken, resetSignal }: { onToken: (t: string) => void; resetSignal?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile || idRef.current) return;
      idRef.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        appearance: "interaction-only",
        callback: onToken,
        "expired-callback": () => onToken(""),
      });
    };
    const t = setInterval(() => {
      if (window.turnstile) {
        clearInterval(t);
        mount();
      }
    }, 200);
    return () => {
      cancelled = true;
      clearInterval(t);
      if (idRef.current) window.turnstile?.remove(idRef.current);
      idRef.current = null;
    };
  }, [onToken]);

  useEffect(() => {
    if (resetSignal && idRef.current) window.turnstile?.reset(idRef.current);
  }, [resetSignal]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" />
      <div ref={ref} className="min-h-0" />
    </>
  );
}
