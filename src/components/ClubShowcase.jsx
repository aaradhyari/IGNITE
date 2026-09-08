import Reveal from './Reveal.jsx'
import ClubCard from './ClubCard.jsx'
import { clubs } from '../data/events.js'

export default function ClubShowcase() {
  return (
    <section
      id="events"
      className="relative mx-auto max-w-editorial scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      <Reveal>
        <p className="label-tech text-amber">// 02 — The four worlds</p>
        <h2 className="display-hero mt-5 max-w-4xl text-ice text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          FOUR WORLDS.
          <br />
          ONE IGNITE.
        </h2>
      </Reveal>

      <div className="mt-16 flex flex-col gap-24 sm:mt-24 sm:gap-32 lg:gap-40">
        {clubs.map((club, i) => (
          <div key={club.id}>
            <ClubCard club={club} index={i} />
            {i < clubs.length - 1 && (
              <div className="hairline mt-24 sm:mt-32 lg:mt-40" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
