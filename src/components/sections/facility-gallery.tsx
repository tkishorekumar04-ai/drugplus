"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SceneIllustration, isIllustration, sceneOf } from "./scene-illustration";

type Img = { id: string; title: string; caption: string | null; imageUrl: string };

function Media({ img, sizes, contain }: { img: Img; sizes: string; contain?: boolean }) {
  return isIllustration(img.imageUrl) ? (
    <SceneIllustration kind={sceneOf(img.imageUrl)} />
  ) : (
    <Image src={img.imageUrl} alt={img.title} fill sizes={sizes} className={contain ? "object-contain" : "object-cover"} />
  );
}

function ParallaxTile({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <m.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
        {children}
      </m.div>
    </div>
  );
}

export function FacilityGallery({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(i);
  };
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open !== null && !dlg.open) dlg.showModal();
    if (open === null && dlg.open) {
      dlg.close();
      lastFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (!images.length) return null;
  const cur = open !== null ? images[open] : null;

  return (
    <LazyMotion features={domAnimation}>
      <ul className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
        {images.map((img, i) => (
          <li key={img.id} className={i === 0 ? "col-span-2 row-span-2" : i === 3 ? "md:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => show(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl text-left focus-visible:ring-4 focus-visible:ring-brand-500/40"
              aria-label={`Open image: ${img.title}`}
            >
              <ParallaxTile>
                <Media img={img} sizes="(min-width:768px) 50vw, 100vw" />
              </ParallaxTile>
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden />
              <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 text-white">
                <span>
                  <span className="block font-bold">{img.title}</span>
                  {img.caption && <span className="mt-0.5 line-clamp-1 block text-sm text-navy-100">{img.caption}</span>}
                </span>
                <ZoomIn className="h-5 w-5 opacity-0 transition group-hover:opacity-100" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto w-[min(1100px,94vw)] max-w-none rounded-2xl bg-transparent p-0 backdrop:bg-navy-950/85 backdrop:backdrop-blur-sm"
        aria-label={cur?.title ?? "Image viewer"}
      >
        {cur && (
          <div className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-900">
              <Media img={cur} sizes="94vw" contain />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="font-bold">{cur.title}</p>
                {cur.caption && <p className="text-sm text-navy-200">{cur.caption}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Next image" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
                <button type="button" onClick={close} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-900 hover:bg-navy-50"><X className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </LazyMotion>
  );
}
