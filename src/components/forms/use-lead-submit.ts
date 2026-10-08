"use client";

import { useCallback, useRef, useState } from "react";
import { readAttribution, track, type AnalyticsEvent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function useLeadSubmit(form: "quick" | "franchise" | "contact" | "product", source: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const started = useRef<number | null>(null);
  const token = useRef("");
  const honeypot = useRef<HTMLInputElement>(null);

  const onFocusCapture = useCallback(() => {
    if (started.current) return;
    started.current = Date.now();
    track("form_start", { form_name: form, form_source: source });
  }, [form, source]);

  const onToken = useCallback((t: string) => {
    token.current = t;
  }, []);

  async function submit(data: Record<string, unknown>) {
    setStatus("submitting");
    setError(null);
    const a = readAttribution();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          data,
          meta: {
            source,
            ...a,
            pageUrl: window.location.pathname + window.location.search,
            company_website: honeypot.current?.value || undefined,
            startedAt: started.current ?? undefined,
            turnstileToken: token.current || undefined,
          },
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; type?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("success");
      const specific: AnalyticsEvent = form === "franchise" ? "franchise_enquiry" : form === "contact" ? "contact_enquiry" : "form_submit";
      track("form_submit", { form_name: form, form_source: source, lead_type: json.type });
      track("generate_lead", { form_name: form, form_source: source, lead_type: json.type });
      if (specific !== "form_submit") track(specific, { form_source: source });
      return true;
    } catch (e) {
      setStatus("error");
      setError((e as Error).message);
      setResetSignal((n) => n + 1);
      return false;
    }
  }

  return { status, error, submit, onFocusCapture, onToken, resetSignal, honeypot, reset: () => setStatus("idle") };
}
