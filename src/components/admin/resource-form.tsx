"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Field } from "@/lib/admin/resources";
import { saveResource, type FormState } from "@/lib/admin/actions";
import { MediaInput } from "./media-input";
import { cn } from "@/lib/utils";

type Opt = { value: string; label: string };

function toInput(f: Field, v: unknown): string {
  if (v == null) return "";
  if (f.type === "date") return new Date(v as string).toISOString().slice(0, 10);
  if (f.type === "specs") return (v as { label: string; value: string }[]).map((r) => `${r.label}: ${r.value}`).join("\n");
  if (f.type === "faq") return (v as { q: string; a: string }[]).map((r) => `Q: ${r.q}\nA: ${r.a}`).join("\n\n");
  return String(v);
}

const base = "w-full rounded-xl border border-line bg-white px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:border-red-500";

export function ResourceForm({
  resourceKey,
  id,
  fields,
  values,
  relationOptions,
  selectedCategories = [],
}: {
  resourceKey: string;
  id: string | null;
  fields: Field[];
  values: Record<string, unknown>;
  relationOptions: Record<string, Opt[]>;
  selectedCategories?: string[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveResource.bind(null, resourceKey, id), undefined);
  const err = (n: string) => state?.fieldErrors?.[n];

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => {
          const v = toInput(f, values[f.name]);
          const idf = `f-${f.name}`;
          const invalid = Boolean(err(f.name)) || undefined;
          let input: React.ReactNode;
          switch (f.type) {
            case "textarea":
              input = <textarea id={idf} name={f.name} defaultValue={v} rows={3} placeholder={f.placeholder} aria-invalid={invalid} className={cn(base, "py-2")} />;
              break;
            case "markdown":
            case "specs":
            case "faq":
              input = <textarea id={idf} name={f.name} defaultValue={v} rows={f.type === "markdown" ? 12 : 6} aria-invalid={invalid} className={cn(base, "py-2 font-mono text-[0.82rem]")} />;
              break;
            case "boolean":
              input = (
                <label className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-medium text-navy-900">
                  <input id={idf} type="checkbox" name={f.name} defaultChecked={Boolean(values[f.name])} className="mt-0.5 h-4 w-4 accent-brand-600" />
                  {f.label}
                </label>
              );
              break;
            case "select":
            case "icon":
            case "relation": {
              const options = f.type === "relation" ? relationOptions[f.name] ?? [] : f.options ?? [];
              input = (
                <select id={idf} name={f.name} defaultValue={v || (f.required ? options[0]?.value : "")} aria-invalid={invalid} className={cn(base, "h-10")}>
                  {!f.required && <option value="">—</option>}
                  {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              );
              break;
            }
            case "categories":
              input = (
                <div className="grid max-h-56 gap-1.5 overflow-y-auto rounded-xl border border-line p-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(relationOptions[f.name] ?? []).map((o) => (
                    <label key={o.value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="categories" value={o.value} defaultChecked={selectedCategories.includes(o.value)} className="h-4 w-4 accent-brand-600" /> {o.label}
                    </label>
                  ))}
                </div>
              );
              break;
            case "image":
            case "file":
              input = <MediaInput name={f.name} defaultValue={v} kind={f.type} invalid={invalid} />;
              break;
            case "number":
              input = <input id={idf} type="number" step={["latitude", "longitude"].includes(f.name) ? "any" : "1"} name={f.name} defaultValue={v} aria-invalid={invalid} className={cn(base, "h-10")} />;
              break;
            case "date":
              input = <input id={idf} type="date" name={f.name} defaultValue={v} aria-invalid={invalid} className={cn(base, "h-10")} />;
              break;
            case "password":
              input = <input id={idf} type="password" name={f.name} autoComplete="new-password" aria-invalid={invalid} className={cn(base, "h-10")} />;
              break;
            default:
              input = <input id={idf} type="text" name={f.name} defaultValue={v} placeholder={f.placeholder} aria-invalid={invalid} className={cn(base, "h-10")} />;
          }
          return (
            <div key={f.name} className={cn(f.wide || ["markdown", "categories", "specs", "faq"].includes(f.type) ? "md:col-span-2" : "")}>
              {f.type !== "boolean" && (
                <label htmlFor={idf} className="mb-1.5 block text-sm font-semibold text-navy-900">
                  {f.label}
                  {f.required && <span className="text-red-600"> *</span>}
                </label>
              )}
              {input}
              {f.help && <p className="mt-1 text-xs text-ink-subtle">{f.help}</p>}
              {err(f.name) && <p className="mt-1 text-xs font-medium text-red-600">{err(f.name)}</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <button disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white disabled:opacity-60">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
        <Link href={`/admin/r/${resourceKey}`} className="text-sm font-semibold text-ink-muted hover:underline">Cancel</Link>
        {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
