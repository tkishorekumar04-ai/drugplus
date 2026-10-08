"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/admin/actions";
import { LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LeadStatusSelect({ id, status, className }: { id: string; status: string; className?: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Lead status"
      defaultValue={status}
      disabled={pending}
      onChange={(e) => start(() => updateLeadStatus(id, e.target.value))}
      className={cn("h-9 rounded-lg border border-line bg-white px-2 text-sm font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50", className)}
    >
      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>)}
    </select>
  );
}
