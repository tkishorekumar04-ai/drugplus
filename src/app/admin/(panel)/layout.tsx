import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logoutAction } from "@/lib/admin/actions";
import { AdminSidebar } from "@/components/admin/sidebar";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newLeads = await prisma.lead.count({ where: { status: "NEW" } });
  return (
    <>
      <AdminSidebar newLeads={newLeads} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-line bg-white/90 px-6 backdrop-blur">
          <span className="text-sm text-ink-muted">{session.name} · <span className="font-semibold text-navy-900">{session.role}</span></span>
          <form action={logoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-navy-900 hover:bg-navy-50"><LogOut className="h-4 w-4" aria-hidden /> Sign out</button>
          </form>
        </header>
        <main className="p-4 pt-6 sm:p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}
