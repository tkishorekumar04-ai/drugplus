import { cn } from "@/lib/utils";

export function Eyebrow({ children, tone = "teal", className }: { children: React.ReactNode; tone?: "teal" | "light"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]",
        tone === "teal" ? "text-teal-700" : "text-teal-200",
        className,
      )}
    >
      <span className={cn("h-px w-6", tone === "teal" ? "bg-teal-500" : "bg-teal-300")} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  as: H = "h2",
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow tone={tone === "light" ? "light" : "teal"}>{eyebrow}</Eyebrow>}
      <H className={cn("mt-3 text-display-md text-balance", tone === "light" ? "text-white" : "text-navy-950")}>{title}</H>
      {description && (
        <p className={cn("mt-4 text-[1.05rem] leading-relaxed text-pretty", tone === "light" ? "text-navy-100/85" : "text-ink-muted")}>{description}</p>
      )}
      {children}
    </div>
  );
}
