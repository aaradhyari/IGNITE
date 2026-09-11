import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { team } from '../data/team.js'
import { clubs } from '../data/events.js'

export default function OurTeam() {
  const [openClub, setOpenClub] = useState('innovation')
  if (!team.length) return null

  return (
    <section
      id="team"
      className="relative scroll-mt-24 border-t border-charcoal py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="label-tech text-amber">// 03 — The crew</p>
          <h2 className="display-hero mt-5 max-w-3xl text-ice text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            The minds
            <br />
            behind it.
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-8 max-w-xl text-silver">
            The organizers, builders and wranglers making IGNITE — Vismaya
            happen. Twenty-four minds, four disciplines — one age of
            wonder.
          </p>
        </Reveal>

        {clubs.map((club, ci) => {
          const members = team.filter((m) => m.clubId === club.id)
          if (!members.length) return null
          const open = openClub === club.id
          return (
            <div key={club.id} className={`${ci === 0 ? 'mt-24 border' : 'mt-px border border-t-0'} border-charcoal`}>
              <button
                onClick={() => setOpenClub(open ? '' : club.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-300 hover:bg-graphite/40 sm:gap-6 sm:px-8"
              >
                <span className="num-tech text-sm text-slate">{club.number}</span>
                <span className="font-display text-xl font-bold tracking-tight text-ice sm:text-2xl" style={{ color: open ? club.color : undefined }}>
                  {club.name}
                </span>
                <span className="hidden font-display text-sm italic text-slate md:inline">
                  {club.tagline}
                </span>
                <span
                  className={`ml-auto font-display text-2xl leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                  style={{ color: club.color }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-500 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-px border-t border-charcoal bg-charcoal/40 sm:grid-cols-2">
                    {members.map((m) => (
                      <div key={m.name} className="bg-obsidian/60 px-5 py-4 sm:px-6">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-display text-base font-bold text-ice sm:text-lg">
                            {m.name}
                          </h3>
                          <p className="label-tech shrink-0 text-[10px]" style={{ color: club.color }}>
                            {m.role}
                          </p>
                        </div>
                        {m.bio && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate">
                            {m.bio}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
