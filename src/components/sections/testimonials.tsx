"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type T = { id: string; quote: string; name: string; role: string | null; city: string | null; company: string | null };

/** Only renders admin-approved, consented testimonials. */
export function TestimonialSlider({ items }: { items: T[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const go = useCallback((d: number) => setI((x) => (x + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (paused || reduce || items.length < 2) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, reduce, go, items.length]);

  if (!items.length) return null;
  const t = items[i];

  return (
    <LazyMotion features={domAnimation}>
      <div
        className="relative mx-auto max-w-4xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Partner testimonials"
      >
        <Quote className="mx-auto h-10 w-10 text-teal-500" aria-hidden />
        <div className="relative mt-6 min-h-[220px] sm:min-h-[180px]" aria-live={paused ? "polite" : "off"}>
          <AnimatePresence mode="wait">
            <m.figure
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-center"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              <blockquote className="text-xl font-medium leading-relaxed text-navy-950 text-balance md:text-2xl">“{t.quote}”</blockquote>
              <figcaption className="mt-6">
                <span className="block font-bold text-navy-950">{t.name}</span>
                <span className="text-sm text-ink-muted">{[t.role, t.company, t.city].filter(Boolean).join(" · ")}</span>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>
        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition hover:bg-navy-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {items.map((x, j) => (
                <button key={x.id} type="button" onClick={() => setI(j)} aria-label={`Show testimonial ${j + 1}`} aria-current={j === i} className={`h-2 rounded-full transition-all ${j === i ? "w-7 bg-navy-900" : "w-2 bg-navy-200"}`} />
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition hover:bg-navy-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
