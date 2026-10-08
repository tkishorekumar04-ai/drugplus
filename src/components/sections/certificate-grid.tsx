"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Download, ExternalLink, FileCheck2, FileText, Landmark, ShieldCheck, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";

type Doc = {
  id: string;
  title: string;
  type: string;
  issuer: string | null;
  number: string | null;
  validUntil: string | null;
  description: string | null;
  fileUrl: string | null;
};

const TYPE_META: Record<string, { label: string; icon: typeof Award }> = {
  CERTIFICATE: { label: "Certificate", icon: ShieldCheck },
  LICENSE: { label: "Licence", icon: Landmark },
  COMPANY_DOCUMENT: { label: "Company Document", icon: FileText },
  MANUFACTURING: { label: "Manufacturing", icon: FileCheck2 },
  AWARD: { label: "Award", icon: Award },
  QUALITY: { label: "Quality Document", icon: FileCheck2 },
};

/** Grid of verified documents with an in-page PDF viewer (native browser PDF renderer). */
export function CertificateGrid({ docs }: { docs: Doc[] }) {
  const [cur, setCur] = useState<Doc | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (cur && !d.open) d.showModal();
    if (!cur && d.open) d.close();
  }, [cur]);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((d) => {
          const meta = TYPE_META[d.type] ?? TYPE_META.CERTIFICATE;
          const I = meta.icon;
          return (
            <li key={d.id} className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100"><I className="h-6 w-6" strokeWidth={1.6} aria-hidden /></span>
                <span className="rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-700">{meta.label}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy-950">{d.title}</h3>
              <dl className="mt-2 space-y-1 text-sm text-ink-muted">
                {d.issuer && <div><dt className="inline font-semibold text-navy-800">Issued by: </dt><dd className="inline">{d.issuer}</dd></div>}
                {d.number && <div><dt className="inline font-semibold text-navy-800">No.: </dt><dd className="inline">{d.number}</dd></div>}
                {d.validUntil && <div><dt className="inline font-semibold text-navy-800">Valid until: </dt><dd className="inline">{formatDate(d.validUntil)}</dd></div>}
              </dl>
              {d.description && <p className="mt-3 text-sm leading-relaxed text-ink-muted">{d.description}</p>}
              <div className="mt-auto flex gap-2 pt-5">
                {d.fileUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setCur(d);
                        track("document_view", { document: d.title });
                      }}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      <FileText className="h-4 w-4" aria-hidden /> View
                    </button>
                    <a href={d.fileUrl} download className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-navy-900 hover:bg-navy-50" aria-label={`Download ${d.title}`}>
                      <Download className="h-4 w-4" aria-hidden />
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-ink-subtle">Available on request</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={ref}
        onClose={() => setCur(null)}
        onClick={(e) => e.target === ref.current && setCur(null)}
        className="m-auto h-[90vh] w-[min(1000px,96vw)] max-w-none overflow-hidden rounded-2xl bg-white p-0 backdrop:bg-navy-950/80"
        aria-label={cur?.title ?? "Document viewer"}
      >
        {cur?.fileUrl && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <p className="truncate font-bold text-navy-950">{cur.title}</p>
              <div className="flex shrink-0 gap-2">
                <a href={cur.fileUrl} target="_blank" rel="noopener" className="grid h-9 w-9 place-items-center rounded-full hover:bg-navy-50" aria-label="Open in new tab"><ExternalLink className="h-4 w-4" /></a>
                <a href={cur.fileUrl} download className="grid h-9 w-9 place-items-center rounded-full hover:bg-navy-50" aria-label="Download"><Download className="h-4 w-4" /></a>
                <button type="button" onClick={() => setCur(null)} className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-white" aria-label="Close viewer"><X className="h-4 w-4" /></button>
              </div>
            </div>
            {/\.(png|jpe?g|webp|avif)$/i.test(cur.fileUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cur.fileUrl} alt={cur.title} className="min-h-0 flex-1 bg-surface object-contain" />
            ) : (
              <object data={`${cur.fileUrl}#view=FitH`} type="application/pdf" className="min-h-0 w-full flex-1" aria-label={cur.title}>
                <div className="p-8 text-center">
                  <p className="text-ink-muted">Your browser cannot display PDFs inline.</p>
                  <a href={cur.fileUrl} className="mt-3 inline-block font-semibold text-brand-600">Download the document</a>
                </div>
              </object>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
