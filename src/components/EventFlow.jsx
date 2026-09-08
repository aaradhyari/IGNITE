import Reveal from './Reveal.jsx'

export default function EventFlow({ event }) {
  const flow = event.flow || []
  if (!flow.length) return null

  return (
    <section className="relative mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <Reveal>
        <p className="label-tech text-amber">// How it works</p>
        <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
          The Flow
        </h2>
      </Reveal>

      {/* Desktop: horizontal timeline */}
      <div className="relative mt-16 hidden lg:block">
        <div className="absolute left-0 right-0 top-9 h-px bg-charcoal" />
        <ol className="grid grid-cols-6 gap-6">
          {flow.map((s, i) => (
            <li key={s.stage} className="relative">
              <span
                className="absolute -top-0 left-0 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              <span className="num-tech text-5xl font-bold text-ice/20">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h4 className="mt-4 font-display text-lg text-ice">
                {s.stage}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {s.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="relative mt-12 space-y-8 border-l border-charcoal pl-8 lg:hidden">
        {flow.map((s, i) => (
          <li key={s.stage} className="relative">
            <span
              className="absolute -left-[2.15rem] top-1 h-2.5 w-2.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
            <span className="num-tech text-3xl font-bold text-ice/25">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h4 className="mt-2 font-display text-base text-ice">
              {s.stage}
            </h4>
            <p className="mt-1 text-sm leading-relaxed text-slate">
              {s.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
