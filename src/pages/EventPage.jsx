import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import EventHero from '../components/EventHero.jsx'
import EventOverview from '../components/EventOverview.jsx'
import EventFlow from '../components/EventFlow.jsx'
import Rules from '../components/Rules.jsx'
import Judging from '../components/Judging.jsx'
import PrizeSection from '../components/PrizeSection.jsx'
import RegistrationForm from '../components/RegistrationForm.jsx'
import { getEventByClub } from '../data/events.js'
import NotFound from './NotFound.jsx'

export default function EventPage() {
  const { club } = useParams()
  const event = getEventByClub(club)

  useEffect(() => {
    if (event) {
      document.title = `${event.title} — IGNITE | Vismaya`
    }
    window.scrollTo(0, 0)
  }, [event])

  if (!event) return <NotFound />

  return (
    <div style={{ '--accent': event.clubColor }}>
      <Navbar />
      <main>
        <EventHero event={event} />
        <EventOverview event={event} />
        <EventFlow event={event} />
        <Rules event={event} />
        <Judging event={event} />
        <PrizeSection event={event} />
        <RegistrationForm event={event} />
      </main>
      <Footer />
    </div>
  )
}
