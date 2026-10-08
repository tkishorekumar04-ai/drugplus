import { marked } from "marked";
import { cn } from "@/lib/utils";

marked.setOptions({ gfm: true, breaks: false });

/** Strip raw HTML & javascript: URLs from markdown authored in the admin (defence in depth). */
function sanitize(md: string) {
  return md.replace(/<\/?(script|iframe|object|embed|style|form|input)[^>]*>/gi, "").replace(/\]\(\s*javascript:[^)]*\)/gi, "](#)");
}

export function Markdown({ content, className }: { content?: string | null; className?: string }) {
  if (!content) return null;
  const html = marked.parse(sanitize(content), { async: false }) as string;
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-navy-950 prose-a:text-brand-600 prose-strong:text-navy-900 prose-li:marker:text-teal-600",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
