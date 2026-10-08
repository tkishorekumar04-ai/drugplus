"use client";

import { useEffect, useRef, useState } from "react";

const COLS: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5" };

type Stat = { id: string; label: string; value: number; suffix: string | null };

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to); // SSR / no-JS shows the real number
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVal(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/** Renders only admin-verified, published statistics. */
export function Stats({ stats, tone = "light" }: { stats: Stat[]; tone?: "light" | "dark" }) {
  if (!stats.length) return null;
  return (
    <section aria-label="Company at a glance" className={tone === "dark" ? "bg-navy-950 text-white" : "border-b border-line bg-white"}>
      <div className="container">
        <dl className={`grid grid-cols-2 ${COLS[Math.min(stats.length, 5)]}`}>
          {stats.map((s, i) => (
            <div key={s.id} className={`flex flex-col gap-1 px-2 py-8 text-center md:py-10 ${i > 0 ? "md:border-l md:border-line" : ""}`}>
              <dt className={`order-2 text-sm font-semibold ${tone === "dark" ? "text-navy-200" : "text-ink-muted"}`}>{s.label}</dt>
              <dd className={`order-1 text-4xl font-extrabold tracking-tight md:text-[2.75rem] ${tone === "dark" ? "text-white" : "text-navy-950"}`}>
                <CountUp to={s.value} suffix={s.suffix ?? ""} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
