import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import EventPage from './pages/EventPage.jsx'
import NotFound from './pages/NotFound.jsx'

// Scroll manager: top on route change, to hash element when present.
function ScrollManager() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      // wait for the target section to mount, then scroll
      let tries = 0
      const tryScroll = () => {
        const el = document.getElementById(location.hash.slice(1))
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (tries < 20) {
          tries += 1
          setTimeout(tryScroll, 50)
        }
      }
      tryScroll()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
  return null
}

export default function App() {
  return (
    <>
      {/* Shared deep-space backdrop (behind all pages) */}
      <div className="space-bg" aria-hidden="true" />
      <div className="nebula" aria-hidden="true" />

      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:club" element={<EventPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
