"use client";

import { FileDown } from "lucide-react";
import { track } from "@/lib/analytics";

/** Fallback "Download Product Information" — uses the print stylesheet to save as PDF. */
export function PrintButton({ label = "Download Product Information", name }: { label?: string; name: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        track("catalogue_download", { product: name, kind: "product-info-print" });
        window.print();
      }}
      className="no-print inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[0.95rem] font-semibold text-navy-900 transition hover:bg-navy-50"
    >
      <FileDown className="h-4 w-4" aria-hidden /> {label}
    </button>
  );
}
