"use client";

import { track, type AnalyticsEvent } from "@/lib/analytics";

/** Anchor that fires an analytics event on click (WhatsApp, call, downloads…). */
export function TrackedLink({
  event,
  params,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { event: AnalyticsEvent; params?: Record<string, string> }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, { location: params?.location ?? "unknown", ...params });
        props.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
