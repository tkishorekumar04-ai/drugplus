import { ICON_KEYS } from "@/components/shared/icon";
import { PRODUCT_TYPES } from "@/lib/constants";

export type FieldType =
  | "text" | "textarea" | "markdown" | "number" | "boolean" | "select" | "image" | "file" | "date"
  | "relation" | "categories" | "specs" | "faq" | "slug" | "icon" | "password" | "url";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  relation?: { model: string; label: string };
  slugFrom?: string;
  wide?: boolean;
  placeholder?: string;
};

export type Column = { name: string; label: string; type?: "boolean" | "date" | "badge" | "relation"; path?: string };

export type Resource = {
  key: string;
  model: string; // prisma delegate name
  label: string;
  singular: string;
  fields: Field[];
  columns: Column[];
  search: string[];
  orderBy: Record<string, "asc" | "desc">[];
  include?: Record<string, unknown>;
  publicPath?: (item: Record<string, unknown>) => string | null;
  adminOnly?: boolean;
  note?: string;
};

const opts = (xs: readonly string[]) => xs.map((x) => ({ value: x, label: x }));
const iconOpts = ICON_KEYS.map((k) => ({ value: k, label: k }));
const statusOpts = opts(["PUBLISHED", "DRAFT", "ARCHIVED"]);
const seo: Field[] = [
  { name: "seoTitle", label: "SEO title", type: "text", help: "Optional – defaults to the name. ~60 characters." },
  { name: "seoDescription", label: "SEO description", type: "textarea", help: "Optional – ~155 characters." },
];

export const RESOURCES: Resource[] = [
  {
    key: "products",
    model: "product",
    label: "Products",
    singular: "Product",
    search: ["name", "brand", "composition"],
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { therapeuticArea: { select: { name: true } }, categories: { select: { categoryId: true } } },
    columns: [
      { name: "name", label: "Name" },
      { name: "composition", label: "Composition" },
      { name: "therapeuticArea", label: "Therapeutic area", type: "relation", path: "therapeuticArea.name" },
      { name: "status", label: "Status", type: "badge" },
      { name: "isFeatured", label: "Featured", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, placeholder: "e.g. Pantoplus-DSR Capsule" },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "name" },
      { name: "brand", label: "Brand", type: "text" },
      { name: "productType", label: "Product type", type: "select", options: opts(PRODUCT_TYPES) },
      { name: "composition", label: "Composition", type: "textarea", required: true, wide: true },
      { name: "categories", label: "Categories (dosage form & range)", type: "categories", wide: true },
      { name: "therapeuticAreaId", label: "Therapeutic area", type: "relation", relation: { model: "therapeuticArea", label: "name" } },
      { name: "packSize", label: "Pack size", type: "text", placeholder: "10 × 10 Tablets (Alu-Alu)" },
      { name: "strengths", label: "Available strengths", type: "text", placeholder: "250 mg, 500 mg" },
      { name: "description", label: "Description", type: "markdown", wide: true },
      { name: "keyInformation", label: "Key information", type: "markdown", wide: true },
      { name: "indications", label: "Indications (company-approved text only)", type: "markdown", wide: true, help: "Leave empty unless supplied/approved by the company. No unsupported medical claims." },
      { name: "specifications", label: "Specifications", type: "specs", wide: true, help: "One per line as  Label: Value" },
      { name: "imageUrl", label: "Product image", type: "image" },
      { name: "pdfUrl", label: "Product information PDF", type: "file" },
      { name: "status", label: "Status", type: "select", options: statusOpts, required: true },
      { name: "isFeatured", label: "Featured on homepage", type: "boolean" },
      { name: "sortOrder", label: "Sort order", type: "number" },
      ...seo,
    ],
    publicPath: (i) => `/products/${i.slug}`,
  },
  {
    key: "categories",
    model: "category",
    label: "Categories",
    singular: "Category",
    search: ["name"],
    orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
    columns: [
      { name: "name", label: "Name" },
      { name: "kind", label: "Kind", type: "badge" },
      { name: "sortOrder", label: "Order" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", slugFrom: "name" },
      { name: "kind", label: "Kind", type: "select", required: true, options: [{ value: "DOSAGE_FORM", label: "Dosage form" }, { value: "RANGE", label: "Range / speciality" }] },
      { name: "icon", label: "Icon", type: "icon", options: iconOpts },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "sortOrder", label: "Sort order", type: "number" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "therapeutic-areas",
    model: "therapeuticArea",
    label: "Therapeutic Areas",
    singular: "Therapeutic Area",
    search: ["name"],
    orderBy: [{ sortOrder: "asc" }],
    columns: [
      { name: "name", label: "Name" },
      { name: "sortOrder", label: "Order" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", slugFrom: "name" },
      { name: "icon", label: "Icon", type: "icon", options: iconOpts },
      { name: "description", label: "Short description", type: "textarea", wide: true },
      { name: "content", label: "Page content", type: "markdown", wide: true },
      { name: "imageUrl", label: "Image", type: "image" },
      { name: "sortOrder", label: "Sort order", type: "number" },
      { name: "isPublished", label: "Published", type: "boolean" },
      ...seo,
    ],
    publicPath: (i) => `/therapeutic-areas/${i.slug}`,
  },
  {
    key: "blog",
    model: "blogPost",
    label: "Blog Posts",
    singular: "Blog Post",
    search: ["title", "excerpt"],
    orderBy: [{ createdAt: "desc" }],
    include: { category: { select: { name: true } } },
    columns: [
      { name: "title", label: "Title" },
      { name: "category", label: "Category", type: "relation", path: "category.name" },
      { name: "status", label: "Status", type: "badge" },
      { name: "publishedAt", label: "Published", type: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "slug", label: "URL slug", type: "slug", slugFrom: "title", help: "Becomes /blog/your-slug" },
      { name: "categoryId", label: "Category", type: "relation", relation: { model: "blogCategory", label: "name" } },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, wide: true },
      { name: "content", label: "Content", type: "markdown", required: true, wide: true },
      { name: "coverImageUrl", label: "Featured image", type: "image" },
      { name: "author", label: "Author", type: "text" },
      { name: "status", label: "Status", type: "select", options: statusOpts, required: true },
      { name: "publishedAt", label: "Publish date", type: "date", help: "Required for published posts; future dates schedule the post." },
      { name: "faq", label: "FAQ (adds FAQ schema)", type: "faq", wide: true, help: "Q: question  then  A: answer, separated by a blank line" },
      ...seo,
    ],
    publicPath: (i) => `/blog/${i.slug}`,
  },
  {
    key: "blog-categories",
    model: "blogCategory",
    label: "Blog Categories",
    singular: "Blog Category",
    search: ["name"],
    orderBy: [{ sortOrder: "asc" }],
    columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", slugFrom: "name" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "testimonials",
    model: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    search: ["name", "quote", "city"],
    orderBy: [{ sortOrder: "asc" }],
    note: "Only publish genuine testimonials from real partners, with their consent. Testimonials appear on the site only when both “Consent confirmed” and “Published” are ticked.",
    columns: [
      { name: "name", label: "Name" },
      { name: "city", label: "City" },
      { name: "consentConfirmed", label: "Consent", type: "boolean" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true, wide: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", placeholder: "PCD Franchise Partner" },
      { name: "company", label: "Company (optional)", type: "text" },
      { name: "city", label: "City", type: "text" },
      { name: "consentConfirmed", label: "I confirm this testimonial is genuine and published with the person's consent", type: "boolean", wide: true },
      { name: "isPublished", label: "Published", type: "boolean" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "certificates",
    model: "certificate",
    label: "Certificates & Documents",
    singular: "Document",
    search: ["title", "issuer"],
    orderBy: [{ sortOrder: "asc" }],
    note: "Documents are shown publicly only when BOTH “Verified” and “Published” are ticked. Never publish a certification the company does not hold.",
    columns: [
      { name: "title", label: "Title" },
      { name: "type", label: "Type", type: "badge" },
      { name: "isVerified", label: "Verified", type: "boolean" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", required: true, options: ["CERTIFICATE", "LICENSE", "COMPANY_DOCUMENT", "MANUFACTURING", "AWARD", "QUALITY"].map((v) => ({ value: v, label: v.replace("_", " ") })) },
      { name: "issuer", label: "Issued by", type: "text" },
      { name: "number", label: "Certificate / licence no.", type: "text" },
      { name: "validUntil", label: "Valid until", type: "date" },
      { name: "description", label: "Description", type: "textarea", wide: true },
      { name: "fileUrl", label: "Document (PDF or image)", type: "file" },
      { name: "isVerified", label: "Verified – the company holds this document", type: "boolean" },
      { name: "isPublished", label: "Published", type: "boolean" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "stats",
    model: "stat",
    label: "Statistics",
    singular: "Statistic",
    search: ["label"],
    orderBy: [{ sortOrder: "asc" }],
    note: "Only publish verified company numbers. Unpublished statistics never appear on the website.",
    columns: [
      { name: "label", label: "Label" },
      { name: "value", label: "Value" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Verified value", type: "number", required: true },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "+" },
      { name: "isPublished", label: "Published (value verified)", type: "boolean" },
      { name: "sortOrder", label: "Sort order", type: "number" },
    ],
  },
  {
    key: "locations",
    model: "location",
    label: "Location Pages",
    singular: "Location Page",
    search: ["name"],
    orderBy: [{ type: "asc" }, { name: "asc" }],
    note: "Each location page must contain genuinely useful local information (market, licensing authority, territories). Avoid near-duplicate pages.",
    columns: [
      { name: "name", label: "Name" },
      { name: "type", label: "Type", type: "badge" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Location name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", slugFrom: "name", help: "URL becomes /pharma-franchise-{slug}" },
      { name: "type", label: "Type", type: "select", required: true, options: [{ value: "STATE", label: "State" }, { value: "CITY", label: "City" }] },
      { name: "stateName", label: "State (for cities)", type: "text" },
      { name: "headline", label: "H1 headline", type: "text", wide: true, placeholder: "PCD Pharma Franchise in …" },
      { name: "intro", label: "Intro", type: "textarea", required: true, wide: true },
      { name: "content", label: "Local content", type: "markdown", required: true, wide: true },
      { name: "coverage", label: "Areas covered (comma separated)", type: "text", wide: true },
      { name: "faq", label: "FAQ", type: "faq", wide: true, help: "Q: question  then  A: answer, separated by a blank line" },
      { name: "isPublished", label: "Published", type: "boolean" },
      ...seo,
    ],
    publicPath: (i) => `/pharma-franchise-${i.slug}`,
  },
  {
    key: "gallery",
    model: "galleryImage",
    label: "Facility Gallery",
    singular: "Gallery Image",
    search: ["title"],
    orderBy: [{ sortOrder: "asc" }],
    note: "Upload real photographs of the company's facilities. Seeded items use branded illustrations (illustration:manufacturing etc.) until replaced.",
    columns: [
      { name: "title", label: "Title" },
      { name: "section", label: "Section" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "caption", label: "Caption", type: "text" },
      { name: "imageUrl", label: "Image", type: "image", required: true },
      { name: "section", label: "Section", type: "select", options: opts(["facility", "quality", "warehouse", "events"]) },
      { name: "sortOrder", label: "Sort order", type: "number" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "export-markets",
    model: "exportMarket",
    label: "Export Markets",
    singular: "Export Market",
    search: ["name", "region"],
    orderBy: [{ sortOrder: "asc" }],
    note: "Mark a market as SERVED only if the company actually supplies it. PROSPECTIVE markets are shown as “open to partnership enquiries”.",
    columns: [
      { name: "name", label: "Name" },
      { name: "status", label: "Status", type: "badge" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "region", label: "Region", type: "text" },
      { name: "status", label: "Status", type: "select", required: true, options: [{ value: "SERVED", label: "Served" }, { value: "PROSPECTIVE", label: "Prospective / open to partners" }] },
      { name: "latitude", label: "Latitude", type: "number", required: true },
      { name: "longitude", label: "Longitude", type: "number", required: true },
      { name: "sortOrder", label: "Sort order", type: "number" },
      { name: "isPublished", label: "Published", type: "boolean" },
    ],
  },
  {
    key: "users",
    model: "user",
    label: "Admin Users",
    singular: "User",
    search: ["name", "email"],
    orderBy: [{ createdAt: "asc" }],
    adminOnly: true,
    columns: [
      { name: "name", label: "Name" },
      { name: "email", label: "Email" },
      { name: "role", label: "Role", type: "badge" },
      { name: "lastLoginAt", label: "Last login", type: "date" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "role", label: "Role", type: "select", required: true, options: [{ value: "ADMIN", label: "Admin" }, { value: "EDITOR", label: "Editor" }] },
      { name: "password", label: "Password", type: "password", help: "Min. 10 characters. Leave blank to keep the current password." },
    ],
  },
];

export const getResource = (key: string) => RESOURCES.find((r) => r.key === key);
