import Reveal from './Reveal.jsx'

export default function EventHero({ event }) {
  const accent = event.clubColor
  const meta = [
    { k: 'FORMAT', v: event.format },
    { k: 'TEAM', v: event.teamSize },
    { k: 'DURATION', v: event.duration },
    { k: 'DATE', v: event.date },
    { k: 'VENUE', v: event.venue },
  ]

  return (
    <section
      className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-28 lg:pt-44"
      style={{ '--accent': accent }}
    >
      {/* atmospheric accent + technical graphic */}
      <div
        className="pointer-events-none absolute -right-32 -top-20 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: accent }}
      />
      <svg
        className="pointer-events-none absolute right-0 top-24 h-72 w-72 opacity-30 lg:h-96 lg:w-96"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="60" stroke={accent} strokeWidth="0.5" />
        <circle cx="100" cy="100" r="85" stroke="#26303B" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="40" stroke="#26303B" strokeWidth="0.5" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#26303B" strokeWidth="0.5" />
        <line x1="0" y1="100" x2="200" y2="100" stroke="#26303B" strokeWidth="0.5" />
        <circle cx="160" cy="100" r="2.5" fill={accent} />
      </svg>

      {/* giant number watermark */}
      <span
        className="pointer-events-none absolute -top-6 left-2 select-none font-display text-[14rem] font-bold leading-none opacity-[0.04] sm:text-[20rem] lg:text-[26rem]"
        style={{ color: accent }}
        aria-hidden="true"
      >
        {event.number}
      </span>

      <div className="relative mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="label-tech" style={{ color: accent }}>
              {event.club}
            </span>
            <span className="h-px w-10 bg-[color:var(--accent)]" />
            <span className="label-tech text-slate">// {event.number}</span>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="display-hero mt-6 text-ice text-[18vw] leading-[0.82] sm:text-[14vw] lg:text-[10rem]">
            {event.title}
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p
            className="mt-4 font-display text-2xl font-medium tracking-tight sm:text-4xl"
            style={{ color: accent }}
          >
            {event.tagline}
          </p>
        </Reveal>

        {/* metadata */}
        <Reveal delay={3}>
          <div className="mt-12 grid grid-cols-2 gap-px border border-charcoal bg-charcoal/40 sm:grid-cols-3 lg:grid-cols-5">
            {meta.map((m) => (
              <div key={m.k} className="bg-obsidian/60 px-5 py-5">
                <div className="label-tech text-slate">{m.k}</div>
                <div className="mt-2 font-display text-base text-ice sm:text-lg">
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
