import { Boxes, Factory, FlaskConical, Microscope, Package, Atom } from "lucide-react";
import { cn } from "@/lib/utils";

const SCENES = {
  manufacturing: { icon: Factory, from: "#0D1E3F", to: "#1F3B70", label: "Manufacturing" },
  laboratory: { icon: FlaskConical, from: "#0C423D", to: "#0D7D6D", label: "Laboratory" },
  quality: { icon: Microscope, from: "#152B55", to: "#1A4FD6", label: "Quality Testing" },
  packaging: { icon: Package, from: "#1F3B70", to: "#0D7D6D", label: "Packaging" },
  research: { icon: Atom, from: "#081430", to: "#2A4C8A", label: "Research" },
  warehouse: { icon: Boxes, from: "#0D5049", to: "#152B55", label: "Warehouse" },
} as const;

export type SceneKind = keyof typeof SCENES;
export const isIllustration = (url: string) => url.startsWith("illustration:");
export const sceneOf = (url: string) => url.replace("illustration:", "") as SceneKind;

/** Branded placeholder artwork for facility imagery until real photographs are uploaded in the admin. */
export function SceneIllustration({ kind, className }: { kind: SceneKind; className?: string }) {
  const s = SCENES[kind] ?? SCENES.manufacturing;
  const I = s.icon;
  return (
    <div className={cn("relative isolate flex h-full w-full items-center justify-center overflow-hidden", className)} style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }} role="img" aria-label={`${s.label} illustration`}>
      <div className="grid-pattern absolute inset-0 opacity-60" />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <svg viewBox="0 0 200 120" className="absolute bottom-0 left-0 w-full text-white/10" aria-hidden>
        <path d="M0 120 V70 l20 -10 v10 l20 -10 v10 l20 -10 v-30 h14 v60 h20 V50 h30 v70z" fill="currentColor" />
        <path d="M120 120 V80 h80 v40z" fill="currentColor" opacity=".6" />
      </svg>
      <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-white/10 ring-1 ring-white/25 backdrop-blur">
        <I className="h-10 w-10 text-white" strokeWidth={1.3} aria-hidden />
      </span>
    </div>
  );
}
