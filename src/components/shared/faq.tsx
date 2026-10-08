import { Plus } from "lucide-react";
import { JsonLd } from "./json-ld";
import { faqSchema } from "@/lib/jsonld";

/** Accessible accordion using native <details>; emits FAQPage schema. */
export function Faq({ items, schema = true }: { items: { q: string; a: string }[]; schema?: boolean }) {
  if (!items.length) return null;
  return (
    <>
      {schema && <JsonLd data={faqSchema(items)} />}
      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-1 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-navy-950">
              {f.q}
              <Plus className="h-5 w-5 shrink-0 text-teal-600 transition group-open:rotate-45" aria-hidden />
            </summary>
            <p className="pb-5 leading-relaxed text-ink-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
