import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV = [
  { label: 'EVENTS', hash: 'events' },
  { label: 'ABOUT', hash: 'about' },
  { label: 'REGISTER', hash: 'register' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy (only relevant on the home page)
  useEffect(() => {
    if (location.pathname !== '/') {
      setActive('')
      return
    }
    const ids = ['events', 'about', 'register']
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [location.pathname])

  const go = (hash) => {
    setOpen(false)
    if (location.pathname === '/') {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/#${hash}`)
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-charcoal/80 bg-obsidian/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-editorial items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-baseline gap-2"
          aria-label="IGNITE home"
        >
          <span className="font-display text-lg font-bold tracking-wide2 text-ice sm:text-xl">
            IGNITE
          </span>
          <span className="hidden h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-amber sm:inline-block" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <button
              key={item.hash}
              onClick={() => go(item.hash)}
              className={`label-tech relative transition-colors duration-300 hover:text-ice ${
                active === item.hash ? 'text-amber' : 'text-silver'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-2 left-0 h-px bg-amber transition-all duration-300 ${
                  active === item.hash ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
          <span className="num-tech text-xs tracking-wide2 text-slate">
            23 NOV 2026
          </span>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-ice transition-transform duration-300 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 bg-ice transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`h-px w-6 bg-ice transition-transform duration-300 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-midnight transition-all duration-500 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ top: 0 }}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="font-display text-lg font-bold tracking-wide2 text-ice">
            IGNITE
          </span>
          <span className="num-tech text-xs tracking-wide2 text-slate">
            23 NOV 2026
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-8 px-8">
          {NAV.map((item) => (
            <button
              key={item.hash}
              onClick={() => go(item.hash)}
              className="text-left font-display text-4xl font-bold tracking-tight text-ice"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-8 pb-12">
          <p className="label-tech">Vismaya — The Age of Wonder</p>
        </div>
      </div>
    </header>
  )
}
