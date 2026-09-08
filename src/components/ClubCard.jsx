import Reveal from './Reveal.jsx'
import EventCard from './EventCard.jsx'
import { getEventsByClub } from '../data/events.js'

export default function ClubCard({ club, index }) {
  const events = getEventsByClub(club.id)
  const flip = index % 2 === 1

  return (
    <Reveal
      className={`grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 ${
        flip ? 'lg:[direction:rtl]' : ''
      }`}
    >
      {/* Club identity */}
      <div
        className={`lg:col-span-5 lg:[direction:ltr] ${
          flip ? 'lg:text-right' : ''
        }`}
      >
        <div
          className="mb-5 h-px w-24"
          style={{ background: club.color }}
        />
        <div className="flex items-baseline gap-4">
          <span
            className="num-tech text-sm"
            style={{ color: club.color }}
          >
            {club.number}
          </span>
          <span className="label-tech text-slate">CLUB</span>
        </div>
        <h3
          className="display-hero mt-3 text-ice text-4xl sm:text-5xl"
          style={{ color: club.color }}
        >
          {club.name}
        </h3>
        <p className="mt-4 font-display text-lg text-silver">
          {club.tagline}
        </p>

        <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate">
          {club.blurb}
        </p>

        <div
          className={`mt-6 flex flex-wrap gap-2 ${
            flip ? 'lg:justify-end' : ''
          }`}
        >
          {club.focus.map((f) => (
            <span
              key={f}
              className="border border-charcoal px-3 py-1 text-[10px] uppercase tracking-wide2 text-silver"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Events for this club */}
      <div className="flex flex-col gap-px lg:col-span-7 lg:[direction:ltr]">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </Reveal>
  )
}
