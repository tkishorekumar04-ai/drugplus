import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, tone = "dark", className }: { items: { name: string; path: string }[]; tone?: "dark" | "light"; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((it, i) => {
            const last = i === all.length - 1;
            return (
              <li key={it.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={tone === "light" ? "text-white" : "text-navy-900"}>{it.name}</span>
                ) : (
                  <Link href={it.path} className={cn("hover:underline", tone === "light" ? "text-navy-200" : "text-ink-muted")}>{it.name}</Link>
                )}
                {!last && <ChevronRight className={cn("h-3.5 w-3.5", tone === "light" ? "text-navy-300" : "text-ink-subtle")} aria-hidden />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
