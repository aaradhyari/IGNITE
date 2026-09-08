import { Link } from 'react-router-dom'

// Editorial event row — number, club, title, tagline, description, arrow.
export default function EventCard({ event }) {
  return (
    <Link
      to={event.path}
      className="group relative block border-t border-charcoal py-7 transition-colors duration-500 hover:bg-graphite/40"
      style={{ '--accent': event.clubColor }}
    >
      {/* expanding accent line */}
      <span
        className="absolute left-0 top-0 h-px w-0 bg-[color:var(--accent)] transition-all duration-500 group-hover:w-full"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-5 sm:gap-8">
          <span className="num-tech mt-1 w-8 shrink-0 text-sm text-slate">
            {event.number}
          </span>
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span
                className="label-tech"
                style={{ color: event.clubColor }}
              >
                {event.club}
              </span>
            </div>
            <h4 className="display-hero mt-2 text-ice text-3xl transition-transform duration-500 group-hover:translate-x-1 sm:text-4xl">
              {event.title}
            </h4>
            <p
              className="mt-2 font-display text-lg italic"
              style={{ color: event.clubColor }}
            >
              {event.tagline}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate">
              {event.description}
            </p>
          </div>
        </div>

        <span className="mt-2 flex shrink-0 items-center gap-2 text-silver transition-all duration-500 group-hover:gap-3 group-hover:text-ice">
          <span className="label-tech hidden sm:inline">Explore</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-500 group-hover:translate-x-1"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  )
}
