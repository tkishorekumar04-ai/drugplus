"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="grid min-h-[70vh] place-items-center bg-surface px-4 py-20">
      <div className="max-w-lg text-center">
        <h1 className="text-display-md text-navy-950">Something went wrong</h1>
        <p className="mt-4 text-ink-muted">Please try again. If the problem continues, call or WhatsApp our team.</p>
        <button onClick={reset} className="mt-8 inline-flex h-11 items-center rounded-full bg-navy-900 px-5 font-semibold text-white">Try again</button>
      </div>
    </main>
  );
}
