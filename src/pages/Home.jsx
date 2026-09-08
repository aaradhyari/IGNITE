import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import ClubShowcase from '../components/ClubShowcase.jsx'
import Footer from '../components/Footer.jsx'
import Reveal from '../components/Reveal.jsx'
import { events } from '../data/events.js'

export default function Home() {
  useEffect(() => {
    document.title = 'IGNITE — Vismaya | The Age of Wonder'
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ClubShowcase />

        {/* Register CTA (home #register anchor) */}
        <section
          id="register"
          className="relative scroll-mt-24 border-t border-charcoal py-24 sm:py-32 lg:py-40"
        >
          <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
            <Reveal>
              <p className="label-tech text-amber">// 03 — Join the mission</p>
              <h2 className="display-hero mt-5 max-w-3xl text-ice text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
                Ready when
                <br />
                you are.
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="mt-8 max-w-xl text-silver">
                Registration happens per event. Choose a challenge from the
                four worlds and secure your place at IGNITE — Vismaya.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <div className="mt-10 flex flex-wrap gap-3">
                {events.map((ev) => (
                  <Link
                    key={ev.id}
                    to={ev.path}
                    className="group flex items-center gap-3 border border-charcoal px-5 py-3 transition-colors duration-300 hover:border-[color:var(--accent)]"
                    style={{ '--accent': ev.clubColor }}
                  >
                    <span className="num-tech text-xs text-slate">
                      {ev.number}
                    </span>
                    <span className="font-display text-sm text-ice">
                      {ev.title}
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
