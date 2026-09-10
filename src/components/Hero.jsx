import { useEffect, useState } from 'react'
import HeroVisual from './HeroVisual.jsx'

// Target: 23 November 2026, 00:00 IST (UTC+5:30)
const TARGET = new Date('2026-11-23T00:00:00+05:30').getTime()

function getRemaining() {
  const diff = TARGET - Date.now()
  if (diff <= 0) return null
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center px-3 sm:px-4">
      <span className="num-tech text-3xl font-semibold text-ice sm:text-4xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="label-tech mt-1 text-slate">{label}</span>
    </div>
  )
}

function Countdown() {
  const [time, setTime] = useState(getRemaining())

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) {
    return (
      <div className="glass mt-10 inline-flex items-center gap-3 px-6 py-4">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber" />
        <span className="font-display text-sm tracking-wide2 text-amber">
          THE WAIT IS OVER.
        </span>
      </div>
    )
  }

  return (
    <div className="glass mt-10 inline-flex items-stretch divide-x divide-charcoal">
      <Unit value={time.days} label="DAYS" />
      <Unit value={time.hours} label="HOURS" />
      <Unit value={time.minutes} label="MINUTES" />
      <Unit value={time.seconds} label="SECONDS" />
    </div>
  )
}

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 lg:pt-24"
      aria-label="IGNITE — Vismaya, The Age of Wonder"
    >
      {/* Aurora backdrop — full bleed */}
      <div className="absolute inset-0">
        <HeroVisual className="h-full w-full" />
      </div>

      {/* Readability fades */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/70 to-transparent lg:hidden" />
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-obsidian/80 via-obsidian/30 to-transparent lg:block" />

      {/* Content — single editorial column */}
      <div className="relative z-10 mx-auto w-full max-w-editorial px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="label-tech text-amber">
            SCIENCE • TECHNOLOGY • CREATIVITY
          </p>

          <h1 className="display-hero mt-5 text-ice text-[22vw] leading-[0.8] sm:text-[16vw] lg:text-[11rem]">
            IGNITE
          </h1>

          <p className="mt-4 font-display text-2xl font-medium tracking-tight text-silver sm:text-3xl">
            Vismaya —{' '}
            <span className="text-ice">The Age of Wonder</span>
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 bg-amber/70" />
            <span className="label-tech text-amber">23–24 NOVEMBER 2026</span>
          </div>

          <p className="mt-6 max-w-md text-base leading-relaxed text-silver">
            Where ideas become experiences, technology becomes imagination,
            and curiosity becomes competition.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              className="btn-primary"
              onClick={() => scrollTo('events')}
            >
              Explore Events
            </button>
            <button className="btn-steel" onClick={() => scrollTo('register')}>
              Register Now
            </button>
          </div>

          {/* Countdown — lives inside Hero.jsx */}
          <Countdown />

          {/* Accessible companion text for the layered backdrop */}
          <p className="sr-only">
            Earth horizon at sunrise over a starfield. IGNITE event location: Indore, Madhya Pradesh, India.
          </p>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label-tech">SCROLL</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-amber to-transparent" />
      </div>
    </section>
  )
}
