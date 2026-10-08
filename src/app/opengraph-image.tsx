import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/settings";

export const alt = "Pharmaceutical company & PCD franchise";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const s = await getSettings();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#081430 0%,#152B55 60%,#0C6459 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D1E3F", fontSize: 38, fontWeight: 800 }}>+</div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{s.company.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, maxWidth: 980 }}>{s.company.tagline}</div>
          <div style={{ fontSize: 28, color: "#A6E5D8" }}>PCD Pharma Franchise · Third-Party Manufacturing · Export</div>
        </div>
      </div>
    ),
    size,
  );
}
