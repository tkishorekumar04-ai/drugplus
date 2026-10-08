import { Breadcrumbs } from "./breadcrumbs";
import { Eyebrow } from "./section-header";
import { MoleculeArt } from "@/components/sections/art";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  aside,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs: { name: string; path: string }[];
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <div className="grid-pattern absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden />
      <div className="absolute -right-32 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-brand-600/25 blur-[100px]" aria-hidden />
      <div className="absolute -bottom-40 left-1/3 -z-10 h-[380px] w-[380px] rounded-full bg-teal-500/15 blur-[100px]" aria-hidden />
      <MoleculeArt className="absolute -right-10 top-1/2 -z-10 hidden h-[140%] -translate-y-1/2 text-white/[0.05] md:block" />
      <div className={cn("container py-12 md:py-16 lg:py-20", aside && "grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]")}>
        <div>
          <Breadcrumbs items={crumbs} tone="light" />
          {eyebrow && <Eyebrow tone="light" className="mt-8">{eyebrow}</Eyebrow>}
          <h1 className={cn("max-w-4xl text-display-lg text-balance", eyebrow ? "mt-3" : "mt-8")}>{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100/85 text-pretty">{description}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}
