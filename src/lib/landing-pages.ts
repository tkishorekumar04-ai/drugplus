import type { LandingConfig } from "@/components/sections/seo-landing";

export const LANDING: Record<string, LandingConfig & { title: string; description: string }> = {
  "pharma-franchise-company": {
    path: "/pharma-franchise-company",
    crumb: "Pharma Franchise Company",
    title: "Pharma Franchise Company in India — Monopoly PCD Opportunities",
    description: "Looking for a reliable pharma franchise company? Monopoly rights, multi-speciality portfolio, promotional support and transparent terms. Enquire today.",
    eyebrow: "Pharma Franchise Company",
    h1: "A Pharma Franchise Company Built Around Its Partners",
    intro: "Choosing a franchise company is a long-term decision. We focus on the things that matter after you sign — product quality, supply reliability and support.",
    highlights: ["Monopoly rights in writing", "Multi-speciality portfolio", "Promotional inputs", "Transparent, written terms"],
    body: `## What to look for in a pharma franchise company

Most companies offer a product list. The difference shows up months later — in whether stock arrives on time, whether doctors trust the products and whether the company respects your territory.

**Before you choose, ask every company:**

1. **Is the monopoly in writing?** Your agreement should name the territory and the products.
2. **What documentation comes with products?** Ask what quality documents are available for your reference.
3. **How are dispatches handled?** Ask about typical dispatch timelines and how back-orders are managed.
4. **What promotional support is included?** Visual aids, literature and samples should be clearly defined.
5. **Who is your point of contact?** A named franchise manager makes a big difference.

## How we work with partners

We keep our franchise model simple: a clear product list, written territory rights, defined promotional support and a dedicated contact for orders and queries. Our portfolio covers the specialities most franchise partners need — general medicine, gastro, cardiac & diabetic, gynaecology, paediatrics, orthopaedics, derma, respiratory and nutraceuticals.`,
    faq: [
      { q: "How do I choose the right pharma franchise company?", a: "Compare written monopoly terms, product documentation, dispatch reliability, promotional support and the quality of communication — not just the product list." },
      { q: "Can I take franchise for selected ranges only?", a: "Yes. Partners can begin with selected speciality ranges and add more as their business grows." },
    ],
    show: { whyChoose: true, products: true, franchiseForm: true },
    interest: "FRANCHISE",
    cta: { label: "Apply for Pharma Franchise", href: "#apply" },
  },
  "third-party-pharma-manufacturing": {
    path: "/third-party-pharma-manufacturing",
    crumb: "Third-Party Manufacturing",
    title: "Third-Party Pharma Manufacturing — Contract Manufacturing for Your Brand",
    description: "Launch your own pharmaceutical brand with third-party (contract) manufacturing: tablets, capsules, syrups, injections, topicals and nutraceuticals with documentation support.",
    eyebrow: "Contract Manufacturing",
    h1: "Third-Party Pharma Manufacturing for Your Brand",
    intro: "Launch and grow your own branded portfolio without investing in a plant. We coordinate manufacturing, packaging and documentation so you can focus on the market.",
    highlights: ["Multiple dosage forms", "Your brand & artwork", "Batch documentation", "Planned timelines"],
    body: `## How third-party manufacturing works with us

1. **Share your product list** — compositions, strengths and pack sizes.
2. **Feasibility & quotation** — we confirm feasibility, minimum batch quantities and timelines.
3. **Artwork & packaging** — your brand, your design, compliant labelling.
4. **Manufacturing & testing** — production at licensed facilities with quality testing.
5. **Dispatch with documentation** — products shipped with the applicable batch documentation.

## Dosage forms

Tablets (including film-coated and MD), capsules (hard gelatin and softgel), oral liquids and dry syrups, injectables, creams, ointments and gels, eye/ear drops and nutraceuticals — subject to feasibility for each product.

## What you'll need

- A wholesale drug licence and GST registration for your marketing company.
- Brand names (we recommend trademark searches before artwork).
- Artwork approval and agreement on quantities and timelines.`,
    faq: [
      { q: "What is the minimum order for third-party manufacturing?", a: "Minimum quantities depend on the dosage form and product. Share your product list and we will confirm batch sizes." },
      { q: "Can you help with packaging design?", a: "Yes, we can coordinate artwork as per your brand guidelines and applicable labelling requirements." },
    ],
    show: { areas: true },
    interest: "MANUFACTURING",
    cta: { label: "Discuss Your Product List", href: "/contact" },
  },
  "pharmaceutical-company-india": {
    path: "/pharmaceutical-company-india",
    crumb: "Pharmaceutical Company in India",
    title: "Pharmaceutical Company in India — Quality Formulations & Partnerships",
    description: "An Indian pharmaceutical company offering quality formulations across therapeutic areas, PCD franchise, third-party manufacturing and export partnerships.",
    eyebrow: "About the Company",
    h1: "An Indian Pharmaceutical Company Focused on Quality & Partnership",
    intro: "We bring together a multi-speciality product portfolio, documented quality processes and a partner-first business model.",
    highlights: ["Multi-speciality formulations", "Franchise & distribution", "Contract manufacturing", "International partnerships"],
    body: `## India's pharmaceutical strength

India is one of the world's largest producers of generic medicines, with a deep manufacturing base and an experienced pharmaceutical workforce. That ecosystem makes it possible to offer a broad, dependable range of formulations to partners across the country and overseas.

## What we do

- **Pharmaceutical formulations** across major therapeutic areas.
- **PCD and monopoly franchise** for marketing partners across India.
- **Distribution** support for stockists and institutions.
- **Third-party manufacturing** for companies launching their own brands.
- **Export** partnerships with documentation support.

## Our approach

We believe long-term relationships are built on consistency: products that perform the same way batch after batch, honest information and commitments that are kept.`,
    faq: [],
    show: { areas: true, whyChoose: true },
    interest: "OTHER",
    cta: { label: "Contact Our Team", href: "/contact" },
  },
  "pharma-products": {
    path: "/pharma-products",
    crumb: "Pharma Products",
    title: "Pharma Products for Franchise & Distribution",
    description: "Browse pharmaceutical products for PCD franchise and distribution: tablets, capsules, syrups, dry syrups, injections, creams, drops and nutraceuticals.",
    eyebrow: "Pharma Products",
    h1: "Pharma Products for Franchise & Distribution Partners",
    intro: "A ready-to-market portfolio across dosage forms and specialities — available to franchise and distribution partners across India.",
    highlights: ["All major dosage forms", "Speciality ranges", "Product search & filters", "Printable catalogue"],
    body: `## Browse by dosage form

Tablets, capsules, syrups, dry syrups, suspensions, injections, creams, ointments, eye/ear drops and nutraceuticals — each listed with composition and pack size.

## Browse by speciality

Choose from general range, gastroenterology, cardiac & diabetic, gynaecology, paediatrics, orthopaedics, dermatology, respiratory, neurology, ophthalmology and nutraceuticals.

## For partners

Product information on this website is intended for healthcare professionals and trade partners. Detailed product literature and commercial terms are shared on request.`,
    faq: [],
    show: { products: true, areas: true },
    interest: "PRODUCT",
    cta: { label: "Search All Products", href: "/products" },
  },
};
