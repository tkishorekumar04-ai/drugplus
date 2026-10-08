"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteResource } from "@/lib/admin/actions";

export function DeleteButton({ resourceKey, id, label }: { resourceKey: string; id: string; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => confirm(`Delete “${label}”? This cannot be undone.`) && start(() => deleteResource(resourceKey, id))}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" aria-hidden /> Delete
    </button>
  );
}
