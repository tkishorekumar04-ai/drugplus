"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Subtle fade-up on scroll. Respects prefers-reduced-motion. */
export function Reveal({ children, delay = 0, className, as = "div", y = 18 }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section"; y?: number }) {
  const reduce = useReducedMotion();
  const Cmp = m[as];
  return (
    <LazyMotion features={domAnimation} strict>
      <Cmp
        className={className}
        initial={reduce ? false : { opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1], delay }}
      >
        {children}
      </Cmp>
    </LazyMotion>
  );
}
