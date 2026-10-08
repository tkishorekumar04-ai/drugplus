import { cn } from "@/lib/utils";

/**
 * Brand-consistent illustrated pack shot used when a product has no photograph yet.
 * Pure SVG (no network, ~2 KB), coloured by therapeutic segment and shaped by dosage form.
 */

const PALETTES = [
  { a: "#1A4FD6", b: "#DCE7FF" }, // blue
  { a: "#0D7D6D", b: "#D2F2EB" }, // teal
  { a: "#B4325A", b: "#FBE1EA" }, // rose
  { a: "#B7791F", b: "#FDF0D5" }, // amber
  { a: "#6D4BC9", b: "#E9E2FB" }, // violet
  { a: "#1F3B70", b: "#E3EBF7" }, // navy
  { a: "#2F855A", b: "#DDF3E6" }, // green
  { a: "#C0502E", b: "#FCE4DA" }, // terracotta
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Shape = "carton" | "bottle" | "vial" | "tube" | "dropper" | "jar";

function shapeFor(form?: string | null): Shape {
  const f = (form || "").toLowerCase();
  if (/(syrup|suspension|liquid)/.test(f)) return "bottle";
  if (/inject/.test(f)) return "vial";
  if (/(cream|ointment|gel)/.test(f)) return "tube";
  if (/(drop)/.test(f)) return "dropper";
  if (/(nutra|powder|sachet|protein)/.test(f)) return "jar";
  return "carton";
}

export function ProductVisual({
  name,
  brand,
  form,
  segment,
  className,
}: {
  name: string;
  brand?: string | null;
  form?: string | null;
  segment?: string | null;
  className?: string;
}) {
  const p = PALETTES[hash(segment || name) % PALETTES.length];
  const shape = shapeFor(form);
  const label = (brand || name).split(/[\s-]/)[0].slice(0, 12).toUpperCase();
  const sub = (form || "").replace(/s$/, "").toUpperCase().slice(0, 14);
  const id = `pv${hash(name + (form || ""))}`;

  return (
    <svg viewBox="0 0 320 240" role="img" aria-label={`${brand || name} — ${form || "product"} illustration`} className={cn("h-full w-full", className)}>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7FAFD" />
          <stop offset="1" stopColor={p.b} />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".10" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".0" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <radialGradient id={`${id}fl`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#0D1E3F" stopOpacity=".22" />
          <stop offset="1" stopColor="#0D1E3F" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="240" fill={`url(#${id}bg)`} />
      <circle cx="262" cy="46" r="70" fill={p.a} opacity=".05" />
      <circle cx="40" cy="214" r="58" fill={p.a} opacity=".05" />
      <ellipse cx="160" cy="204" rx="104" ry="11" fill={`url(#${id}fl)`} />

      {shape === "carton" && (
        <g>
          {/* blister strip behind */}
          <g transform="translate(176 92) rotate(10)">
            <rect width="92" height="104" rx="8" fill="#E9EEF5" stroke="#C9D3E1" />
            {[0, 1, 2].map((r) =>
              [0, 1].map((c) => <ellipse key={`${r}${c}`} cx={26 + c * 40} cy={22 + r * 30} rx="13" ry="9" fill="#fff" stroke="#BAC6D6" />),
            )}
          </g>
          {/* carton: top, side, front */}
          <path d="M70 70 L92 56 L212 56 L190 70 Z" fill="#fff" stroke="#DCE3EE" />
          <path d="M190 70 L212 56 L212 186 L190 200 Z" fill="#E7EDF5" />
          <rect x="70" y="70" width="120" height="130" fill="#fff" />
          <rect x="70" y="70" width="120" height="8" fill={p.a} />
          <path d="M70 160 h120 v40 h-120z" fill={p.a} />
          <path d="M70 160 C110 146 150 172 190 152 V160 H70Z" fill={p.a} opacity=".55" />
          <text x="80" y="108" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="17" fill="#0D1E3F">{label}</text>
          <text x="80" y="124" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="8.5" letterSpacing="1.4" fill="#4B5B73">{sub || "TABLET"}</text>
          <rect x="80" y="134" width="44" height="3" rx="1.5" fill={p.a} opacity=".35" />
          <rect x="80" y="141" width="70" height="3" rx="1.5" fill="#0D1E3F" opacity=".12" />
          <text x="80" y="186" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="8" letterSpacing="1.2" fill="#fff" opacity=".9">Rx ONLY</text>
          <rect x="70" y="70" width="120" height="130" fill={`url(#${id}sh)`} opacity=".5" />
        </g>
      )}

      {shape === "bottle" && (
        <g>
          <rect x="133" y="40" width="54" height="22" rx="4" fill="#1F2B3D" />
          <rect x="133" y="40" width="54" height="22" rx="4" fill={`url(#${id}sh)`} />
          <path d="M140 62 h40 v10 c18 8 26 18 26 34 v86 c0 7-5 12-12 12 h-68 c-7 0-12-5-12-12 v-86 c0-16 8-26 26-34z" fill="#8A4B12" />
          <path d="M140 62 h40 v10 c18 8 26 18 26 34 v86 c0 7-5 12-12 12 h-68 c-7 0-12-5-12-12 v-86 c0-16 8-26 26-34z" fill={`url(#${id}sh)`} />
          <rect x="114" y="112" width="92" height="70" rx="3" fill="#fff" />
          <rect x="114" y="112" width="92" height="9" fill={p.a} />
          <text x="160" y="146" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="14" fill="#0D1E3F">{label}</text>
          <text x="160" y="160" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="7.5" letterSpacing="1.3" fill="#4B5B73">{sub || "SYRUP"}</text>
          <rect x="136" y="168" width="48" height="3" rx="1.5" fill={p.a} opacity=".4" />
          <rect x="198" y="80" width="5" height="96" rx="2.5" fill="#fff" opacity=".25" />
        </g>
      )}

      {shape === "vial" && (
        <g>
          {[-58, 0, 58].map((dx, i) => (
            <g key={i} transform={`translate(${dx} ${i === 1 ? -8 : 6})`} opacity={i === 1 ? 1 : 0.85}>
              <rect x="143" y="50" width="34" height="14" rx="3" fill={p.a} />
              <rect x="147" y="64" width="26" height="10" fill="#B8C3D3" />
              <path d="M140 74 h40 c4 0 6 3 6 7 v108 c0 5-3 8-8 8 h-36 c-5 0-8-3-8-8 v-108 c0-4 2-7 6-7z" fill="#EEF4FA" stroke="#C9D3E1" />
              <rect x="134" y="160" width="52" height="36" fill={p.b} opacity=".7" />
              <rect x="134" y="112" width="52" height="40" fill="#fff" />
              <rect x="134" y="112" width="52" height="5" fill={p.a} />
              {i === 1 && <text x="160" y="137" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="9.5" fill="#0D1E3F">{label.slice(0, 8)}</text>}
              {i === 1 && <text x="160" y="147" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="5.5" letterSpacing="1" fill="#4B5B73">INJECTION</text>}
              <path d="M140 74 h40 c4 0 6 3 6 7 v108 c0 5-3 8-8 8 h-36 c-5 0-8-3-8-8 v-108 c0-4 2-7 6-7z" fill={`url(#${id}sh)`} />
            </g>
          ))}
        </g>
      )}

      {shape === "tube" && (
        <g transform="rotate(-14 160 130)">
          <rect x="226" y="113" width="30" height="34" rx="5" fill="#1F2B3D" />
          <path d="M70 104 L214 112 Q226 113 226 124 V136 Q226 147 214 148 L70 156 Q62 156 62 148 V112 Q62 104 70 104Z" fill="#fff" stroke="#DCE3EE" />
          <path d="M62 112 h10 v36 h-10z" fill="#DCE3EE" />
          <path d="M150 108.6 L214 112 Q226 113 226 124 V136 Q226 147 214 148 L150 151.4Z" fill={p.a} />
          <text x="84" y="134" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="15" fill="#0D1E3F">{label.slice(0, 9)}</text>
          <text x="84" y="145" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="6.5" letterSpacing="1.2" fill="#4B5B73">{sub || "CREAM"}</text>
          <path d="M70 104 L214 112 Q226 113 226 124 V136 Q226 147 214 148 L70 156 Q62 156 62 148 V112 Q62 104 70 104Z" fill={`url(#${id}sh)`} opacity=".35" />
        </g>
      )}

      {shape === "dropper" && (
        <g>
          <path d="M152 28 h16 l6 30 h-28z" fill="#fff" stroke="#C9D3E1" />
          <rect x="140" y="56" width="40" height="24" rx="4" fill={p.a} />
          <path d="M132 80 h56 c6 0 10 4 10 10 v98 c0 6-4 10-10 10 h-56 c-6 0-10-4-10-10 v-98 c0-6 4-10 10-10z" fill="#fff" stroke="#DCE3EE" />
          <rect x="122" y="112" width="76" height="58" fill={p.b} />
          <rect x="122" y="112" width="76" height="6" fill={p.a} />
          <text x="160" y="142" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="12" fill="#0D1E3F">{label.slice(0, 9)}</text>
          <text x="160" y="155" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="6.5" letterSpacing="1.2" fill="#4B5B73">{sub || "DROPS"}</text>
          <path d="M132 80 h56 c6 0 10 4 10 10 v98 c0 6-4 10-10 10 h-56 c-6 0-10-4-10-10 v-98 c0-6 4-10 10-10z" fill={`url(#${id}sh)`} />
        </g>
      )}

      {shape === "jar" && (
        <g>
          <rect x="104" y="58" width="112" height="28" rx="6" fill={p.a} />
          <rect x="104" y="58" width="112" height="28" rx="6" fill={`url(#${id}sh)`} />
          <path d="M100 86 h120 c6 0 10 4 10 10 v92 c0 8-6 12-14 12 h-112 c-8 0-14-4-14-12 v-92 c0-6 4-10 10-10z" fill="#fff" stroke="#DCE3EE" />
          <rect x="90" y="112" width="140" height="60" fill={p.b} />
          <text x="160" y="142" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="16" fill="#0D1E3F">{label}</text>
          <text x="160" y="158" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="7" letterSpacing="1.4" fill="#4B5B73">{sub || "NUTRACEUTICAL"}</text>
          <path d="M100 86 h120 c6 0 10 4 10 10 v92 c0 8-6 12-14 12 h-112 c-8 0-14-4-14-12 v-92 c0-6 4-10 10-10z" fill={`url(#${id}sh)`} />
        </g>
      )}
    </svg>
  );
}
