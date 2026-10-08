import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { getCategories, getCertificates, getFeaturedProducts, getGallery, getLatestPosts, getStats, getTestimonials, getTherapeuticAreas } from "@/lib/queries";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { AboutSplit } from "@/components/sections/about-split";
import { WhyChoose } from "@/components/sections/why-choose";
import { ProductsShowcase } from "@/components/sections/products-showcase";
import { FranchiseBand } from "@/components/sections/franchise-band";
import { Partnerships } from "@/components/sections/partnerships";
import { PartnerBenefits } from "@/components/sections/partner-benefits";
import { QualitySection } from "@/components/sections/quality";
import { FacilityGallery } from "@/components/sections/facility-gallery";
import { TherapeuticGrid } from "@/components/sections/therapeutic-grid";
import { TestimonialSlider } from "@/components/sections/testimonials";
import { BlogCard } from "@/components/sections/blog-card";
import { FinalCta } from "@/components/sections/final-cta";
import { SectionHeader } from "@/components/shared/section-header";
import { LinkButton } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return buildMetadata({ title: s.seo.defaultTitle, absoluteTitle: true, path: "/" });
}

export default async function HomePage() {
  const [s, stats, categories, featured, areas, testimonials, posts, certificates, gallery] = await Promise.all([
    getSettings(),
    getStats(),
    getCategories(),
    getFeaturedProducts(8),
    getTherapeuticAreas(),
    getTestimonials(),
    getLatestPosts(3),
    getCertificates(),
    getGallery("facility"),
  ]);

  return (
    <>
      <Hero s={s} />
      <Stats stats={stats} />
      <AboutSplit companyName={s.company.name} imageUrl={s.about.imageUrl} body={s.about.body} />
      <WhyChoose />
      <ProductsShowcase categories={categories} products={featured} catalogueUrl={s.catalogueUrl} />
      <FranchiseBand />
      <Partnerships />
      <PartnerBenefits />
      <QualitySection certificates={certificates.filter((c) => c.type === "CERTIFICATE").slice(0, 6)} />
      {gallery.length > 0 && (
        <section className="bg-surface pb-20 md:pb-28" aria-labelledby="facility-title">
          <div className="container">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <SectionHeader eyebrow="Infrastructure" title={<span id="facility-title">Manufacturing & Facilities</span>} description="A look at the infrastructure behind our products — from production and testing to packaging and storage." />
            </div>
            <FacilityGallery images={gallery} />
          </div>
        </section>
      )}
      <section className="section bg-white" aria-labelledby="areas-title">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader eyebrow="Therapeutic Areas" title={<span id="areas-title">Specialised ranges for every practice</span>} description="Focused portfolios that help partners serve general practitioners, specialists and hospitals." />
            <LinkButton href="/therapeutic-areas" variant="outline" className="shrink-0">All therapeutic areas <ArrowRight aria-hidden /></LinkButton>
          </div>
          <div className="mt-12">
            <TherapeuticGrid areas={areas} />
          </div>
        </div>
      </section>
      {testimonials.length > 0 && (
        <section className="section bg-surface" aria-labelledby="testimonials-title">
          <div className="container">
            <SectionHeader align="center" eyebrow="Partner Voices" title={<span id="testimonials-title">What our partners say</span>} />
            <div className="mt-12">
              <TestimonialSlider items={testimonials} />
            </div>
          </div>
        </section>
      )}
      {posts.length > 0 && (
        <section className="section bg-white" aria-labelledby="blog-title">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeader eyebrow="Insights" title={<span id="blog-title">Guides for pharma entrepreneurs</span>} description="Practical articles on PCD franchise, licensing and growing a pharmaceutical business." />
              <LinkButton href="/blog" variant="outline" className="shrink-0">Visit the blog <ArrowRight aria-hidden /></LinkButton>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {posts.map((p, i) => (
                <li key={p.id}><BlogCard post={p} index={i} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
