import Reveal from './Reveal.jsx'

export default function Judging({ event }) {
  const judging = event.judging || []
  if (!judging.length) return null

  return (
    <section className="relative mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label-tech text-amber">// Criteria</p>
            <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
              Judging
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate">
              Every submission is measured against a transparent, weighted
              framework. These are the weights the panel will apply.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="space-y-px">
            {judging.map((j, i) => (
              <Reveal
                key={j.criterion}
                delay={i}
                className="border-t border-charcoal py-6"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-display text-lg text-ice sm:text-xl">
                    {j.criterion}
                  </span>
                  <span
                    className="num-tech text-2xl font-semibold sm:text-3xl"
                    style={{ color: 'var(--accent)' }}
                  >
                    {j.percent}%
                  </span>
                </div>
                <div className="mt-3 h-px w-full bg-charcoal">
                  <div
                    className="h-px"
                    style={{
                      background: 'var(--accent)',
                      width: `${j.percent}%`,
                    }}
                  />
                </div>
              </Reveal>
            ))}
            <div className="border-t border-charcoal" />
          </div>
        </div>
      </div>
    </section>
  )
}
