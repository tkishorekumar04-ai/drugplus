import "server-only";
import type { LeadType, Prisma } from "@prisma/client";
import { prisma } from "./db";
import { INTEREST_OPTIONS } from "./constants";
import type { LeadPayload } from "./validation";
import type { CrmLead } from "./crm";

const interestLabel = (v: string) => INTEREST_OPTIONS.find((o) => o.value === v)?.label ?? v;

const ENQUIRY_TYPE_TO_LEAD: Record<string, LeadType> = {
  "PCD Pharma Franchise": "FRANCHISE",
  "Monopoly Franchise": "MONOPOLY",
  "Distributor Opportunity": "DISTRIBUTOR",
  "Third-Party Manufacturing": "MANUFACTURING",
  "Export / International": "EXPORT",
  "Product Information": "PRODUCT",
};

export async function createLead(payload: LeadPayload, ctx: { ipHash: string; userAgent: string | null }) {
  const { meta } = payload;
  const base = {
    source: meta.source,
    utmSource: meta.utmSource,
    utmMedium: meta.utmMedium,
    utmCampaign: meta.utmCampaign,
    utmTerm: meta.utmTerm,
    utmContent: meta.utmContent,
    gclid: meta.gclid,
    landingPage: meta.landingPage,
    pageUrl: meta.pageUrl,
    referrer: meta.referrer,
    ipHash: ctx.ipHash,
    userAgent: ctx.userAgent?.slice(0, 300) ?? null,
  } satisfies Partial<Prisma.LeadCreateInput>;

  let data: Prisma.LeadCreateInput;
  let extra: Record<string, string | undefined> = {};

  switch (payload.form) {
    case "quick": {
      const d = payload.data;
      const [city, ...st] = d.location.split(",").map((s) => s.trim());
      data = {
        ...base,
        type: d.interestedIn as LeadType,
        name: d.name,
        phone: d.phone,
        email: d.email,
        city,
        state: st.join(", ") || null,
        businessType: d.businessType,
        interestedIn: interestLabel(d.interestedIn),
      };
      break;
    }
    case "franchise": {
      const d = payload.data;
      data = {
        ...base,
        type: d.franchiseType,
        name: d.name,
        phone: d.phone,
        email: d.email,
        city: d.city,
        state: d.state,
        interestedIn: d.franchiseType === "MONOPOLY" ? "Monopoly Franchise" : "PCD Pharma Franchise",
        interestedCategory: d.productSegment,
        franchiseEnquiry: {
          create: {
            preferredTerritory: d.preferredTerritory,
            businessExperience: d.businessExperience,
            investmentRange: d.investmentRange,
            productSegment: d.productSegment,
          },
        },
      };
      extra = { territory: d.preferredTerritory, experience: d.businessExperience, investment: d.investmentRange };
      break;
    }
    case "contact": {
      const d = payload.data;
      data = {
        ...base,
        type: ENQUIRY_TYPE_TO_LEAD[d.enquiryType] ?? "CONTACT",
        name: d.name,
        phone: d.phone,
        email: d.email,
        interestedIn: d.enquiryType,
        message: d.message,
        contactEnquiry: { create: { enquiryType: d.enquiryType, message: d.message } },
      };
      break;
    }
    case "product": {
      const d = payload.data;
      const product = await prisma.product.findUnique({
        where: { id: d.productId },
        select: { id: true, name: true, categories: { select: { category: { select: { name: true } } }, take: 1 } },
      });
      data = {
        ...base,
        type: "PRODUCT",
        name: d.name,
        phone: d.phone,
        email: d.email,
        city: d.city,
        message: d.message,
        interestedIn: "Product Enquiry",
        interestedCategory: product?.categories[0]?.category.name,
        ...(product ? { product: { connect: { id: product.id } } } : {}),
      };
      extra = { product: product?.name ?? d.productName };
      break;
    }
  }

  const lead = await prisma.lead.create({ data });
  const crmLead: CrmLead = {
    id: lead.id,
    type: lead.type,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    state: lead.state,
    businessType: lead.businessType,
    interestedIn: lead.interestedIn,
    interestedCategory: lead.interestedCategory,
    message: lead.message,
    source: lead.source,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    landingPage: lead.landingPage,
    createdAt: lead.createdAt.toISOString(),
    extra,
  };
  return { lead, crmLead };
}
