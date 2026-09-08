import Reveal from './Reveal.jsx'

export default function EventOverview({ event }) {
  return (
    <section className="relative mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label-tech text-amber">// The challenge</p>
            <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
              Overview
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={1}>
            <p className="max-w-2xl font-display text-xl leading-relaxed text-silver sm:text-2xl">
              {event.overview || event.description}
            </p>
          </Reveal>

          {event.deliverables && event.deliverables.length > 0 && (
            <Reveal delay={2}>
              <div className="mt-12">
                <p className="label-tech text-slate">DELIVERABLES</p>
                <ul className="mt-5 space-y-3">
                  {event.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-4 border-t border-charcoal py-4 text-silver"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {event.specialRule && (
            <Reveal delay={3}>
              <div className="mt-10 border-l-2 border-[color:var(--accent)] bg-graphite/40 py-5 pl-6 pr-4">
                <p className="label-tech text-slate">SPECIAL RULE</p>
                <p className="mt-2 text-ice">{event.specialRule}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
