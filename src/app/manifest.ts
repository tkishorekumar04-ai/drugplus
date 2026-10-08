import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.company.name,
    short_name: s.company.shortName,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0D1E3F",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
