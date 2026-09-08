import Reveal from './Reveal.jsx'

export default function PrizeSection({ event }) {
  const prizes = event.prizes || []
  if (!prizes.length) return null

  const winner = prizes.find((p) => p.type === 'winner')
  const runner = prizes.find((p) => p.type === 'runnerup')
  const special = prizes.filter((p) => p.type === 'special')

  return (
    <section className="relative mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <Reveal>
        <p className="label-tech text-amber">// Recognition</p>
        <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
          Prizes
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px border border-charcoal bg-charcoal/30 lg:grid-cols-2">
        {/* Winner */}
        <div className="bg-obsidian/60 p-8 sm:p-10">
          <p className="label-tech text-slate">WINNER</p>
          <p
            className="mt-4 font-display text-3xl font-bold tracking-tight text-ice sm:text-4xl"
            style={{ color: 'var(--accent)' }}
          >
            {winner ? winner.title : 'Winner'}
          </p>
        </div>

        {/* Runner-up */}
        <div className="bg-obsidian/60 p-8 sm:p-10">
          <p className="label-tech text-slate">RUNNER-UP</p>
          <p className="mt-4 font-display text-2xl font-medium text-ice sm:text-3xl">
            {runner ? runner.title : 'Runner-up'}
          </p>
        </div>
      </div>

      {/* Special awards */}
      {special.length > 0 && (
        <div className="mt-px">
          <p className="label-tech mt-12 text-slate">SPECIAL AWARDS</p>
          <ul className="mt-5 grid grid-cols-1 gap-px border border-charcoal bg-charcoal/30 sm:grid-cols-2 lg:grid-cols-3">
            {special.map((p) => (
              <li
                key={p.title}
                className="flex items-center gap-4 bg-obsidian/60 px-6 py-6"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                <span className="font-display text-base text-silver sm:text-lg">
                  {p.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
