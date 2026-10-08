import type { Metadata } from "next";
import { getSettings } from "./settings";
import { absoluteUrl } from "./utils";

type BuildMeta = {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  absoluteTitle?: boolean;
};

export async function buildMetadata({ title, description, path, image, type = "website", noIndex, publishedTime, absoluteTitle }: BuildMeta): Promise<Metadata> {
  const s = await getSettings();
  const desc = description || s.seo.defaultDescription;
  const ogImage = image || s.seo.ogImageUrl || "/opengraph-image";
  const fullTitle = title ? (absoluteTitle ? title : s.seo.titleTemplate.replace("%s", title)) : s.seo.defaultTitle;
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: s.company.name,
      title: fullTitle,
      description: desc,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || s.company.name }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: desc, images: [ogImage] },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
