"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";

/** URL field with an upload button (images or PDFs) that posts to /api/admin/upload. */
export function MediaInput({ name, defaultValue, kind, invalid }: { name: string; defaultValue?: string | null; kind: "image" | "file"; invalid?: boolean }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      setValue(data.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isImg = kind === "image" && value && !value.startsWith("illustration:") && !/\.pdf$/i.test(value);
  return (
    <div>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={kind === "image" ? "https://… or upload" : "https://….pdf or upload"}
          aria-invalid={invalid || undefined}
          className="h-10 min-w-0 flex-1 rounded-xl border border-line px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:border-red-500"
        />
        <label className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-sm font-semibold text-navy-900 hover:bg-navy-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
          <input ref={inputRef} type="file" className="sr-only" accept={kind === "image" ? "image/png,image/jpeg,image/webp,image/avif" : "application/pdf,image/png,image/jpeg,image/webp"} onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        {value && <button type="button" onClick={() => setValue("")} className="grid h-10 w-10 place-items-center rounded-xl border border-line" aria-label="Clear"><X className="h-4 w-4" /></button>}
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {isImg && <img src={value} alt="" className="mt-2 h-24 w-auto rounded-lg border border-line object-contain" />}
      {value && !isImg && <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted"><FileText className="h-3.5 w-3.5" /> {value}</p>}
    </div>
  );
}
