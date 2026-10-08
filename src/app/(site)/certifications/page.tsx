import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getCertificates } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { CertificateGrid } from "@/components/sections/certificate-grid";
import { LinkButton } from "@/components/ui/button";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Certifications, Licences & Documents", description: "View and download our verified certifications, licences and company documents.", path: "/certifications" });
}

export default async function CertificationsPage() {
  const docs = await getCertificates();
  return (
    <>
      <PageHero crumbs={[{ name: "Certifications", path: "/certifications" }]} eyebrow="Trust & Compliance" title="Certifications & Documents" description="Certificates, licences, manufacturing and quality documents — verified and available to view or download." />
      <section className="section bg-surface">
        <div className="container">
          {docs.length ? (
            <CertificateGrid docs={JSON.parse(JSON.stringify(docs))} />
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-10 text-center">
              <p className="text-lg font-bold text-navy-950">Documents available on request</p>
              <p className="mt-2 text-ink-muted">Our team shares copies of applicable certifications and licences with partners during onboarding.</p>
              <LinkButton href="/contact" className="mt-6">Request documents</LinkButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
