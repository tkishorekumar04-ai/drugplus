import type { SiteSettings } from "./settings";
import { absoluteUrl, SITE_URL } from "./utils";

export function organizationSchema(s: SiteSettings) {
  const sameAs = Object.values(s.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: s.company.name,
    legalName: s.company.legalName,
    url: SITE_URL,
    logo: s.company.logoUrl ? absoluteUrl(s.company.logoUrl) : absoluteUrl("/icon.svg"),
    description: s.company.description,
    email: s.contact.email,
    telephone: s.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.contact.address,
      addressLocality: s.contact.city,
      addressRegion: s.contact.state,
      postalCode: s.contact.postalCode || undefined,
      addressCountry: "IN",
    },
    contactPoint: [
      { "@type": "ContactPoint", telephone: s.contact.phone, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "hi"] },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: s.company.name,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; image?: string | null; publishedAt?: Date | null; updatedAt: Date; author?: string | null }, s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: absoluteUrl(a.path),
    image: a.image ? [absoluteUrl(a.image)] : undefined,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    author: { "@type": a.author ? "Person" : "Organization", name: a.author || s.company.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Product schema without offers/reviews: we never publish prices or invented ratings. */
export function productSchema(p: { name: string; slug: string; composition: string; brand?: string | null; imageUrl?: string | null; description?: string | null; category?: string }, s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    url: absoluteUrl(`/products/${p.slug}`),
    image: absoluteUrl(p.imageUrl || "/opengraph-image"),
    description: p.description || `${p.name} — composition: ${p.composition}.`,
    brand: { "@type": "Brand", name: p.brand || s.company.name },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    category: p.category,
  };
}
