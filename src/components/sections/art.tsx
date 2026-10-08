import { cn } from "@/lib/utils";

/** Decorative hexagonal molecule line-art (currentColor). */
export function MoleculeArt({ className }: { className?: string }) {
  const hex = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
  const nodes: [number, number][] = [
    [300, 220], [404, 280], [404, 400], [300, 460], [196, 400], [196, 280], [508, 220], [612, 280], [612, 400], [508, 460], [716, 220], [300, 100], [92, 460], [508, 580], [716, 460],
  ];
  return (
    <svg viewBox="0 0 800 700" fill="none" className={cn(className)} aria-hidden>
      <g stroke="currentColor" strokeWidth="2.2">
        <polygon points={hex(300, 340, 120)} />
        <polygon points={hex(508, 340, 120)} />
        <polygon points={hex(404, 520, 120)} opacity=".6" />
        <polygon points={hex(612, 160, 120)} opacity=".5" />
        <line x1="300" y1="220" x2="300" y2="100" />
        <line x1="196" y1="400" x2="92" y2="460" />
        <line x1="508" y1="460" x2="508" y2="580" />
        <line x1="612" y1="400" x2="716" y2="460" />
        <line x1="612" y1="280" x2="716" y2="220" />
        <polygon points={hex(300, 340, 92)} opacity=".5" />
      </g>
      <g fill="currentColor">
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 9 : 6} />
        ))}
      </g>
    </svg>
  );
}

/** Modern "product UI" style composition used in place of stock photography. */
export function QualityPanelArt({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden rounded-3xl bg-navy-900", className)} aria-hidden>
      <div className="grid-pattern absolute inset-0 opacity-70" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
      <MoleculeArt className="absolute -right-10 top-6 h-[70%] text-white/[0.08]" />
      {/* Bottle + carton line-art */}
      <svg viewBox="0 0 360 300" className="absolute bottom-0 left-1/2 h-[78%] -translate-x-1/2">
        <defs>
          <linearGradient id="qpa-g" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".18" />
            <stop offset="1" stopColor="#fff" stopOpacity=".04" />
          </linearGradient>
        </defs>
        <ellipse cx="180" cy="292" rx="150" ry="10" fill="#000" opacity=".25" />
        <rect x="58" y="120" width="120" height="170" rx="6" fill="url(#qpa-g)" stroke="#fff" strokeOpacity=".35" />
        <rect x="58" y="120" width="120" height="10" fill="#35B6A1" />
        <rect x="72" y="150" width="70" height="8" rx="4" fill="#fff" opacity=".7" />
        <rect x="72" y="166" width="44" height="5" rx="2.5" fill="#fff" opacity=".35" />
        <rect x="58" y="240" width="120" height="50" fill="#1A4FD6" opacity=".7" />
        <path d="M222 70 h44 v16 c18 8 26 18 26 34 v158 c0 7-5 12-12 12 h-72 c-7 0-12-5-12-12 v-158 c0-16 8-26 26-34z" fill="url(#qpa-g)" stroke="#fff" strokeOpacity=".35" />
        <rect x="216" y="40" width="56" height="30" rx="5" fill="#fff" opacity=".85" />
        <rect x="200" y="150" width="88" height="80" rx="3" fill="#fff" opacity=".9" />
        <rect x="200" y="150" width="88" height="9" fill="#35B6A1" />
        <rect x="212" y="176" width="58" height="7" rx="3.5" fill="#0D1E3F" opacity=".7" />
        <rect x="212" y="190" width="38" height="5" rx="2.5" fill="#0D1E3F" opacity=".3" />
      </svg>
      {/* floating cards */}
      <div className="absolute left-5 top-5 w-48 rounded-2xl bg-white/95 p-4 text-navy-900 shadow-lift backdrop-blur sm:left-7 sm:top-7">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-teal-700">Quality Checks</p>
        <ul className="mt-2.5 space-y-2 text-[0.8rem] font-semibold">
          {["Raw material testing", "In-process control", "Finished product QC"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-teal-500 text-[0.55rem] text-white">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
