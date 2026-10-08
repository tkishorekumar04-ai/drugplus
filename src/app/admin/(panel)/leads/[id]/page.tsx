import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { deleteLead, retryLeadSync } from "@/lib/admin/actions";
import { enabledCrmProviders } from "@/lib/crm";
import { LEAD_TYPE_LABEL } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";
import { PageTitle, Panel, dt } from "@/components/admin/ui";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { LeadNotes } from "@/components/admin/lead-notes";
import { WhatsAppIcon } from "@/components/shared/social-icons";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [l, session] = await Promise.all([
    prisma.lead.findUnique({ where: { id }, include: { franchiseEnquiry: true, contactEnquiry: true, product: { select: { name: true, slug: true } } } }),
    getSession(),
  ]);
  if (!l) notFound();
  const rows: [string, React.ReactNode][] = [
    ["Type", LEAD_TYPE_LABEL[l.type]],
    ["Phone", l.phone],
    ["Email", l.email],
    ["City", l.city],
    ["State", l.state],
    ["Business type", l.businessType],
    ["Interested in", l.interestedIn],
    ["Category / segment", l.interestedCategory],
    ["Preferred territory", l.franchiseEnquiry?.preferredTerritory],
    ["Business experience", l.franchiseEnquiry?.businessExperience],
    ["Investment range", l.franchiseEnquiry?.investmentRange],
    ["Enquiry type", l.contactEnquiry?.enquiryType],
    ["Product", l.product ? <Link key="p" className="text-brand-600 hover:underline" href={`/products/${l.product.slug}`} target="_blank">{l.product.name}</Link> : null],
    ["Message", l.message],
  ];
  const attribution: [string, React.ReactNode][] = [
    ["Form / source", l.source],
    ["UTM source", l.utmSource],
    ["UTM medium", l.utmMedium],
    ["UTM campaign", l.utmCampaign],
    ["UTM term", l.utmTerm],
    ["UTM content", l.utmContent],
    ["GCLID", l.gclid],
    ["Landing page", l.landingPage],
    ["Submitted on", l.pageUrl],
    ["Referrer", l.referrer],
    ["Received", dt(l.createdAt)],
  ];
  const Table = ({ data }: { data: [string, React.ReactNode][] }) => (
    <dl className="divide-y divide-line text-sm">
      {data.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} className="grid grid-cols-[160px_1fr] gap-3 py-2.5"><dt className="font-semibold text-navy-900">{k}</dt><dd className="whitespace-pre-wrap break-words text-ink-muted">{v}</dd></div>
      ))}
    </dl>
  );

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft className="h-4 w-4" aria-hidden /> All leads</Link>
      <PageTitle
        title={l.name}
        description={`${LEAD_TYPE_LABEL[l.type]} enquiry · ${dt(l.createdAt)}`}
        actions={
          <>
            <a href={`tel:${l.phone}`} className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white"><Phone className="h-4 w-4" aria-hidden /> Call</a>
            <a href={whatsappLink(l.phone.length === 10 ? `91${l.phone}` : l.phone, `Hello ${l.name}, thank you for your enquiry.`)} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#147A3E] px-4 text-sm font-semibold text-white"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
            <LeadStatusSelect id={l.id} status={l.status} className="h-10 rounded-full" />
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel title="Enquiry details"><Table data={rows} /></Panel>
        <div className="space-y-6">
          <Panel title="Notes"><LeadNotes id={l.id} notes={l.notes} /></Panel>
          <Panel title="Attribution"><Table data={attribution} /></Panel>
          <Panel title="CRM sync">
            <p className="text-sm text-ink-muted">
              {enabledCrmProviders().length === 0 ? "No CRM integrations configured." : l.crmSyncError ? <span className="text-red-600">Last sync error: {l.crmSyncError}</span> : l.crmSyncedAt ? `Synced ${dt(l.crmSyncedAt)}` : "Not yet synced."}
            </p>
            {enabledCrmProviders().length > 0 && (
              <form action={retryLeadSync.bind(null, l.id)} className="mt-3"><button className="rounded-full border border-line px-4 py-2 text-sm font-semibold">Retry sync</button></form>
            )}
          </Panel>
          {session?.role === "ADMIN" && (
            <form action={deleteLead.bind(null, l.id)}>
              <button className="text-sm font-semibold text-red-600 hover:underline">Delete lead permanently</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
