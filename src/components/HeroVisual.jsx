/* Lightweight observatory dial — pure CSS/SVG, no WebGL */

const CLUSTERS = [
  { id: '01', label: 'INNOVATION', color: '#FFB800', pos: 'left-[6%] top-[18%]' },
  { id: '02', label: 'IT & LOGIC', color: '#5B8CFF', pos: 'right-[8%] top-[24%]' },
  { id: '03', label: 'PHOTOGRAPHY', color: '#E8E8E8', pos: 'left-[12%] bottom-[20%]' },
  { id: '04', label: 'ROBOTICS', color: '#FF5C5C', pos: 'right-[10%] bottom-[16%]' },
]

export default function HeroVisual({ className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      role="img"
      aria-label="Observatory dial marking the four IGNITE clusters around a central signal"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(420px 320px at 50% 50%, rgba(255,184,0,0.12), transparent 65%), radial-gradient(560px 420px at 50% 55%, rgba(91,140,255,0.08), transparent 65%)',
        }}
      />

      {/* Rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="h-[280px] w-[280px] rounded-full border border-charcoal/70 sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div
          className="h-[400px] w-[400px] rounded-full border border-dashed border-amber/30 sm:h-[540px] sm:w-[540px] lg:h-[620px] lg:w-[620px]"
          style={{ animation: 'hero-orbit 60s linear infinite' }}
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        <div className="h-[520px] w-[520px] rounded-full border border-charcoal/40 sm:h-[700px] sm:w-[700px] lg:h-[800px] lg:w-[800px]" />
      </div>

      {/* Crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-charcoal/30" aria-hidden="true" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-charcoal/30" aria-hidden="true" />

      {/* Central core */}
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <span className="absolute h-40 w-40 rounded-full bg-amber/10 blur-2xl" />
        <span className="absolute h-16 w-16 animate-ping rounded-full bg-amber/10" />
        <span className="relative h-3.5 w-3.5 rounded-full bg-amber shadow-[0_0_28px_8px_rgba(255,184,0,0.45)]" />
        <span className="absolute h-10 w-10 rounded-full border border-amber/40" />
      </div>

      {/* Central label */}
      <div className="absolute left-1/2 top-1/2 mt-14 -translate-x-1/2 text-center">
        <p className="num-tech text-[10px] tracking-[0.28em] text-slate">VIS-26.11</p>
        <p className="label-tech mt-1 text-[10px] text-ice">PRIMARY SIGNAL</p>
      </div>

      {/* Cluster nodes */}
      {CLUSTERS.map((c) => (
        <div key={c.id} className={`absolute ${c.pos} flex items-center gap-2`}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: c.color, boxShadow: `0 0 12px 2px ${c.color}66` }}
            aria-hidden="true"
          />
          <span className="hidden flex-col sm:flex">
            <span className="num-tech text-[10px] text-slate">{c.id} //</span>
            <span className="label-tech text-[10px] text-ice">{c.label}</span>
          </span>
        </div>
      ))}

      {/* Coordinates */}
      <p className="num-tech absolute bottom-6 right-6 hidden text-[9px] tracking-[0.22em] text-slate/80 md:block" aria-hidden="true">
        22.72°N · 75.86°E — IND-01
      </p>

      <style>{`@keyframes hero-orbit { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`}</style>
    </div>
  )
}
