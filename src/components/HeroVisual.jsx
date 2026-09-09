import { useEffect, useRef, useState } from 'react'

/* BackDrop plate as the hero background — full-bleed space horizon
   with a slow Ken Burns drift + scroll parallax. */

const BACKDROP_URL = '/BackDrop.png'

export default function HeroVisual({ className = '' }) {
  const backRef = useRef(null)
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const pre = new Image()
    pre.src = BACKDROP_URL

    if (reduced) return undefined

    let queued = false
    function read() {
      const section = document.getElementById('top')
      if (!section || !backRef.current) return
      const rect = section.getBoundingClientRect()
      const p = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1.25)
      backRef.current.style.transform = `translate3d(0, ${(p * 80).toFixed(1)}px, 0) scale(${(1.08 + p * 0.04).toFixed(3)})`
      backRef.current.style.opacity = `${Math.max(1 - p * 0.5, 0.3).toFixed(3)}`
    }
    function onScroll() {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        read()
      })
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <div className={`relative overflow-hidden bg-[#04060d] ${className}`} aria-hidden="true">
      {/* The plate */}
      <div ref={backRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.08)' }}>
        <img
          src={BACKDROP_URL}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={reduced ? undefined : { animation: 'hero-kenburns 36s ease-in-out infinite alternate' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        {/* Light grade to seat it in the system */}
        <div className="absolute inset-0 bg-obsidian/20" />
        <div className="absolute inset-0 bg-amber/5 mix-blend-overlay" />
      </div>

      {/* Melt into page + vignette + grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,6,13,0.5) 0%, transparent 26%, transparent 60%, #07090D 100%), radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.45) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.07,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      <style>{`@keyframes hero-kenburns { from { transform: scale(1) translateY(0); } to { transform: scale(1.07) translateY(-1.5%); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`}</style>
    </div>
  )
}
