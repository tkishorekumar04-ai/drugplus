import { WORLD_DOTS, WORLD_H, WORLD_W, project } from "./world-dots";

type Market = { id: string; name: string; region: string | null; status: "SERVED" | "PROSPECTIVE"; latitude: number; longitude: number };

/** Dotted world map. Markers come from Admin → Export Markets; status decides the style. */
export function WorldMap({ markets, homeLabel = "India (HQ)" }: { markets: Market[]; homeLabel?: string }) {
  const home = project(78.9, 21.5);
  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Markets map</title>
        <desc id="map-desc">{markets.map((m) => `${m.name}: ${m.status === "SERVED" ? "served" : "open to partnerships"}`).join("; ")}</desc>
        <defs>
          <radialGradient id="mk-glow">
            <stop offset="0" stopColor="#35B6A1" stopOpacity=".55" />
            <stop offset="1" stopColor="#35B6A1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={WORLD_DOTS} stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" className="text-white/20" />
        {markets
          .filter((m) => m.name !== "India")
          .map((m) => {
            const p = project(m.longitude, m.latitude);
            const mx = (home.x + p.x) / 2;
            const my = Math.min(home.y, p.y) - Math.abs(home.x - p.x) * 0.25 - 10;
            return (
              <path
                key={`arc-${m.id}`}
                d={`M${home.x} ${home.y} Q${mx} ${my} ${p.x} ${p.y}`}
                fill="none"
                stroke={m.status === "SERVED" ? "#35B6A1" : "#93AEDA"}
                strokeWidth="1.6"
                strokeDasharray={m.status === "SERVED" ? undefined : "4 5"}
                opacity=".8"
              />
            );
          })}
        {markets.map((m) => {
          const p = project(m.longitude, m.latitude);
          const served = m.status === "SERVED";
          return (
            <g key={m.id}>
              {served && <circle cx={p.x} cy={p.y} r="22" fill="url(#mk-glow)" />}
              <circle cx={p.x} cy={p.y} r={served ? 6.5 : 5} fill={served ? "#35B6A1" : "#0D1E3F"} stroke={served ? "#fff" : "#93AEDA"} strokeWidth="2" />
              <text x={p.x} y={p.y - 13} textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" className="hidden sm:block" style={{ paintOrder: "stroke", stroke: "#081430", strokeWidth: 4 }}>
                {m.name === "India" ? homeLabel : m.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-4 flex flex-wrap gap-5 text-sm text-navy-200">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-400 ring-2 ring-white" aria-hidden /> Markets served</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-navy-950 ring-2 ring-navy-300" aria-hidden /> Open to partnership enquiries</span>
      </figcaption>
    </figure>
  );
}
