import Reveal from './Reveal.jsx'

export default function Rules({ event }) {
  const rules = event.rules || []
  if (!rules.length) return null

  return (
    <section className="relative mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <Reveal>
        <p className="label-tech text-amber">// The rules</p>
        <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
          Rules
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px lg:grid-cols-2 lg:gap-x-16">
        {rules.map((rule, i) => (
          <Reveal
            key={i}
            delay={i % 2}
            className="flex items-start gap-5 border-t border-charcoal py-6"
          >
            <span
              className="num-tech w-10 shrink-0 text-sm"
              style={{ color: 'var(--accent)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-silver">{rule}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
