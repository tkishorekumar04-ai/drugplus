"use client";

import { preservingSubmit } from "@/components/admin/use-preserving-action";
import { useActionState } from "react";
import { updateLeadNotes, type FormState } from "@/lib/admin/actions";

export function LeadNotes({ id, notes }: { id: string; notes: string | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateLeadNotes.bind(null, id), undefined);
  return (
    <form onSubmit={preservingSubmit(action)}>
      <label htmlFor="notes" className="sr-only">Notes</label>
      <textarea id="notes" name="notes" defaultValue={notes ?? ""} rows={6} className="w-full rounded-xl border border-line p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Call notes, follow-up date, territory discussed…" />
      <div className="mt-2 flex items-center gap-3">
        <button disabled={pending} className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save notes"}</button>
        {state?.ok && <span className="text-sm text-emerald-700">Saved</span>}
      </div>
    </form>
  );
}
