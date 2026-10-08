import { Suspense } from "react";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Logo } from "@/components/layout/logo";
import { FloatingActions } from "@/components/layout/floating-actions";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/jsonld";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const [areas, ranges] = await Promise.all([
    prisma.therapeuticArea.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }).catch(() => []),
    prisma.category.findMany({ where: { isPublished: true, kind: "RANGE" }, orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }).catch(() => []),
  ]);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <JsonLd data={[organizationSchema(s), websiteSchema(s)]} />
      <Header logo={<Logo name={s.company.name} logoUrl={s.company.logoUrl} />} phone={s.contact.phone} whatsapp={s.contact.whatsapp} whatsappMessage={s.whatsappMessage} />
      <main id="main">{children}</main>
      <Footer s={s} areas={areas} ranges={ranges} />
      <FloatingActions phone={s.contact.phone} whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
      <CookieBanner />
      <Suspense fallback={null}>
        <AnalyticsScripts />
      </Suspense>
    </>
  );
}
