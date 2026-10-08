-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CategoryKind" AS ENUM ('DOSAGE_FORM', 'RANGE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CERTIFICATE', 'LICENSE', 'COMPANY_DOCUMENT', 'MANUFACTURING', 'AWARD', 'QUALITY');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STATE', 'CITY');

-- CreateEnum
CREATE TYPE "MarketStatus" AS ENUM ('SERVED', 'PROSPECTIVE');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('FRANCHISE', 'MONOPOLY', 'DISTRIBUTOR', 'MANUFACTURING', 'EXPORT', 'PRODUCT', 'CONTACT', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "CategoryKind" NOT NULL DEFAULT 'RANGE',
    "description" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapeutic_areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "icon" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapeutic_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT,
    "composition" TEXT NOT NULL,
    "productType" TEXT,
    "packSize" TEXT,
    "strengths" TEXT,
    "description" TEXT,
    "keyInformation" TEXT,
    "indications" TEXT,
    "specifications" JSONB,
    "imageUrl" TEXT,
    "pdfUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "therapeuticAreaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "author" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "faq" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "city" TEXT,
    "company" TEXT,
    "consentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL DEFAULT 'CERTIFICATE',
    "issuer" TEXT,
    "number" TEXT,
    "validUntil" TIMESTAMP(3),
    "description" TEXT,
    "fileUrl" TEXT,
    "thumbnailUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT DEFAULT '+',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "LocationType" NOT NULL DEFAULT 'STATE',
    "stateName" TEXT,
    "headline" TEXT,
    "intro" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverage" TEXT,
    "faq" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_markets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "status" "MarketStatus" NOT NULL DEFAULT 'PROSPECTIVE',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "export_markets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "imageUrl" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'facility',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL DEFAULT 'OTHER',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "state" TEXT,
    "businessType" TEXT,
    "interestedIn" TEXT,
    "interestedCategory" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "gclid" TEXT,
    "landingPage" TEXT,
    "pageUrl" TEXT,
    "referrer" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "notes" TEXT,
    "crmSyncedAt" TIMESTAMP(3),
    "crmSyncError" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "franchise_enquiries" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "preferredTerritory" TEXT,
    "businessExperience" TEXT,
    "investmentRange" TEXT,
    "productSegment" TEXT,

    CONSTRAINT "franchise_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_enquiries" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "enquiryType" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "contact_enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_kind_isPublished_sortOrder_idx" ON "categories"("kind", "isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "therapeutic_areas_slug_key" ON "therapeutic_areas"("slug");

-- CreateIndex
CREATE INDEX "therapeutic_areas_isPublished_sortOrder_idx" ON "therapeutic_areas"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_status_isFeatured_idx" ON "products"("status", "isFeatured");

-- CreateIndex
CREATE INDEX "products_therapeuticAreaId_idx" ON "products"("therapeuticAreaId");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_brand_idx" ON "products"("brand");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_idx" ON "product_categories"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_posts_categoryId_idx" ON "blog_posts"("categoryId");

-- CreateIndex
CREATE INDEX "certificates_isPublished_isVerified_sortOrder_idx" ON "certificates"("isPublished", "isVerified", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "locations_slug_key" ON "locations"("slug");

-- CreateIndex
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt");

-- CreateIndex
CREATE INDEX "leads_type_createdAt_idx" ON "leads"("type", "createdAt");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- CreateIndex
CREATE INDEX "leads_phone_idx" ON "leads"("phone");

-- CreateIndex
CREATE INDEX "leads_ipHash_createdAt_idx" ON "leads"("ipHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "franchise_enquiries_leadId_key" ON "franchise_enquiries"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_enquiries_leadId_key" ON "contact_enquiries"("leadId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_therapeuticAreaId_fkey" FOREIGN KEY ("therapeuticAreaId") REFERENCES "therapeutic_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franchise_enquiries" ADD CONSTRAINT "franchise_enquiries_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_enquiries" ADD CONSTRAINT "contact_enquiries_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
