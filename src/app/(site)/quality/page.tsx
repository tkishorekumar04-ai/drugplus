import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getCertificates, getGallery } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { QualitySection } from "@/components/sections/quality";
import { FacilityGallery } from "@/components/sections/facility-gallery";
import { CertificateGrid } from "@/components/sections/certificate-grid";
import { FinalCta } from "@/components/sections/final-cta";
import { LinkButton } from "@/components/ui/button";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Quality & Manufacturing", description: "Our approach to quality control, manufacturing standards, testing, packaging, storage and supply chain.", path: "/quality" });
}

export default async function QualityPage() {
  const [s, certs, gallery] = await Promise.all([getSettings(), getCertificates(), getGallery("facility")]);
  return (
    <>
      <PageHero crumbs={[{ name: "Quality", path: "/quality" }]} eyebrow="Quality & Manufacturing" title="Quality You Can Trust" description="From raw material to dispatch, quality is designed into every step of how our products are made, tested, stored and delivered." />
      <QualitySection certificates={[]} />
      {gallery.length > 0 && (
        <section className="bg-surface pb-20">
          <div className="container">
            <SectionHeader eyebrow="Manufacturing Facility" title="Infrastructure behind our products" className="mb-8" />
            <FacilityGallery images={gallery} />
          </div>
        </section>
      )}
      <section className="section bg-white" aria-labelledby="cert-h">
        <div className="container">
          <SectionHeader eyebrow="Certifications" title={<span id="cert-h">Certifications & approvals</span>} description="Only certifications and licences that have been verified are shown here. Copies are available to partners on request." />
          <div className="mt-10">
            {certs.length ? (
              <CertificateGrid docs={JSON.parse(JSON.stringify(certs))} />
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-ink-muted">
                Certification documents are shared with partners during onboarding. <LinkButton href="/contact" variant="link" className="h-auto">Request copies</LinkButton>
              </div>
            )}
          </div>
        </div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
