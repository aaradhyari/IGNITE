import Reveal from './Reveal.jsx'

export default function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-editorial scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label-tech text-amber">// 01 — Manifesto</p>
            <h2 className="display-hero mt-5 text-ice text-5xl sm:text-6xl lg:text-7xl">
              WHAT IS
              <br />
              IGNITE?
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={1}>
            <p className="max-w-2xl font-display text-xl leading-relaxed text-silver sm:text-2xl">
              IGNITE is a celebration of{' '}
              <span className="text-ice">curiosity, creativity and technology</span>{' '}
              — bringing four worlds together under one idea: wonder.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <div className="mt-12 max-w-2xl space-y-px">
              {[
                {
                  k: 'INNOVATION',
                  v: 'The discipline of turning a question into something the world has never seen.',
                },
                {
                  k: 'IT',
                  v: 'Thinking precisely and building resilient systems that make machines do the impossible.',
                },
                {
                  k: 'PHOTOGRAPHY',
                  v: 'Training the eye to notice what everyone else walks past.',
                },
                {
                  k: 'ROBOTICS',
                  v: 'Giving intelligence a body and sending it, autonomously, into the arena.',
                },
              ].map((row, i) => (
                <div
                  key={row.k}
                  className="group flex flex-col gap-2 border-t border-charcoal py-5 transition-colors hover:border-amber/60 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="num-tech w-10 shrink-0 text-sm text-slate">
                    0{i + 1}
                  </span>
                  <span className="label-tech w-40 shrink-0 text-ice">
                    {row.k}
                  </span>
                  <span className="text-silver">{row.v}</span>
                </div>
              ))}
              <div className="border-t border-charcoal" />
            </div>
          </Reveal>

          <Reveal delay={3}>
            <p className="mt-12 max-w-2xl text-silver">
              Four clubs. Four lenses. One shared belief — that to understand
              the world you must first be willing to look at it differently.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
