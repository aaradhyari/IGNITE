import { Link } from 'react-router-dom'
import { clubs, getEventsByClub } from '../data/events.js'

export default function Footer() {
  return (
    <footer className="relative border-t border-charcoal bg-obsidian/60">
      <div className="mx-auto max-w-editorial px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold tracking-wide2 text-ice">
              IGNITE
            </Link>
            <p className="mt-3 font-display text-sm text-silver">
              Vismaya — The Age of Wonder
            </p>
            <p className="label-tech mt-5 text-amber">23–24 November 2026</p>
          </div>

          {/* Navigate */}
          <div>
            <p className="label-tech text-slate">Navigate</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/#events" className="text-silver transition-colors hover:text-ice">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-silver transition-colors hover:text-ice">
                  About
                </Link>
              </li>
              <li>
                <Link to="/#register" className="text-silver transition-colors hover:text-ice">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Clubs */}
          <div>
            <p className="label-tech text-slate">Clubs</p>
            <ul className="mt-4 space-y-2 text-sm">
              {clubs.map((c) => {
                const ev = getEventsByClub(c.id)[0]
                return (
                  <li key={c.id}>
                    {ev ? (
                      <Link
                        to={ev.path}
                        className="transition-colors hover:text-ice"
                        style={{ color: c.color }}
                      >
                        {c.name}
                      </Link>
                    ) : (
                      <span style={{ color: c.color }}>{c.name}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2">
            <p className="label-tech text-slate">Contact</p>
            <p className="mt-4 text-sm text-silver">
              TO BE ANNOUNCED
            </p>
            <p className="label-tech mt-6 text-slate">School</p>
            <p className="mt-2 text-sm text-silver">TO BE ANNOUNCED</p>
          </div>
        </div>

        <div className="hairline mt-14" />
        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-slate sm:flex-row sm:items-center">
          <span>© 2026 IGNITE — Vismaya. All rights reserved.</span>
          <span className="label-tech">CURIOSITY · WONDER · DISCOVERY</span>
        </div>
      </div>
    </footer>
  )
}
