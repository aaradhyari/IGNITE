import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { events } from '../data/events.js'
import {
  REGISTRATION_API_URL,
  isRegistrationConfigured,
} from '../config/registration.js'

const CONTACT_EMAIL = 'aaradhyar000@gmail.com'
// Auto-reply confirmations are sent from this address (the Google
// account that deploys the Apps Script backend).
const SENDER_EMAIL = 'aaradhyar000@gmail.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = { status: 'idle', errors: {} }

export default function Contact() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    eventId: events[0]?.id || '',
    message: '',
  })
  const [state, setState] = useState(EMPTY)

  const onChange = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    if (state.errors[name]) {
      setState((s) => ({
        ...s,
        errors: { ...s.errors, [name]: undefined },
      }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!values.name.trim()) errors.name = 'Required'
    if (!values.email.trim()) errors.email = 'Required'
    else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email'
    if (!values.message.trim()) errors.message = 'Required'
    if (Object.keys(errors).length) {
      setState({ status: 'idle', errors })
      return
    }

    // Honest handling: if the backend is not configured,
    // we must NOT fake a successful send.
    if (!isRegistrationConfigured()) {
      setState({ status: 'unconfigured', errors: {} })
      return
    }

    setState({ status: 'loading', errors: {} })
    const event = events.find((ev) => ev.id === values.eventId)
    const payload = {
      action: 'contact-query',
      name: values.name.trim(),
      email: values.email.trim(),
      eventId: values.eventId,
      event: event ? event.title : 'General',
      club: event ? event.club : '',
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    }

    try {
      const ctrl = new AbortController()
      // Apps Script cold starts + two outgoing mails can take a while —
      // don't abort while the server is still working on a send that will succeed.
      const t = setTimeout(() => ctrl.abort(), 30000)
      // Form-encoded body: Apps Script exposes it as e.parameter.
      // Urlencoded POSTs are CORS-simple (no preflight) — the proven pattern.
      await fetch(REGISTRATION_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(payload),
        signal: ctrl.signal,
      })
      clearTimeout(t)
      setState({ status: 'sent', errors: {} })
    } catch (err) {
      setState({
        status: 'error',
        errors: {},
        message:
          'We could not send your query. Please try again shortly.',
      })
    }
  }

  const inputClass = (name) =>
    `w-full bg-midnight px-4 py-3 text-ice placeholder:text-slate border outline-none transition-colors duration-300 focus:border-amber ${
      state.errors[name] ? 'border-igniteRed' : 'border-charcoal'
    }`

  const selected = events.find((ev) => ev.id === values.eventId)

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 border-t border-charcoal py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label-tech text-amber">// 04 — Contact</p>
                <h2 className="display-hero mt-4 text-ice text-5xl sm:text-6xl lg:text-7xl">
                  Talk
                  <br />
                  to us.
                </h2>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-slate">
                  Questions about events, teams or registrations — pick the
                  event, write your query, and the crew will get back to you.
                </p>

                <div className="mt-10 flex flex-col gap-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group flex items-center gap-4 border border-charcoal bg-graphite/60 px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_20px_60px_-24px_rgba(255,184,0,0.5)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-amber">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" stroke="#07090D" strokeWidth="2" />
                        <path d="M3 7l9 6 9-6" stroke="#07090D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>
                      <span className="label-tech block text-slate">Email us</span>
                      <span className="mt-1 block font-display text-base text-ice break-all">
                        {CONTACT_EMAIL}
                      </span>
                    </span>
                  </a>
                  <div className="flex items-center gap-4 border border-charcoal bg-graphite/60 px-5 py-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-amber">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
                          stroke="#07090D"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="2.5" stroke="#07090D" strokeWidth="2" />
                      </svg>
                    </span>
                    <span>
                      <span className="label-tech block text-slate">Venue</span>
                      <span className="mt-1 block font-display text-base text-ice">
                        To Be Announced
                      </span>
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={1}>
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="border border-charcoal bg-graphite/40 p-6 sm:p-9"
                  aria-label="Ask a query about an event"
                >
                  {state.status === 'sent' ? (
                    <div className="py-10 text-center">
                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-amber/60 bg-amber/10">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="#FFB800"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    <h3 className="font-display text-2xl text-ice">
                      Query received.
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-silver">
                      Thanks{values.name.trim() ? `, ${values.name.trim().split(' ')[0]}` : ''} — we got
                      your query about {selected ? selected.title : 'the event'}.
                      A confirmation is on its way to {values.email.trim() || 'your inbox'} from{' '}
                      {SENDER_EMAIL}.
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-sm text-slate">
                      Can't find it? Check your spam folder and mark it as not spam.
                    </p>
                      <button
                        type="button"
                        className="btn-ghost mt-7"
                        onClick={() => setState({ status: 'idle', errors: {} })}
                      >
                        Ask another query
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="q-name" className="label-tech mb-2 block text-slate">
                            Your Name <span className="text-amber"> *</span>
                          </label>
                          <input
                            id="q-name"
                            name="name"
                            type="text"
                            value={values.name}
                            onChange={onChange('name')}
                            placeholder="Diya Patel"
                            aria-invalid={!!state.errors.name}
                            className={inputClass('name')}
                          />
                          {state.errors.name && (
                            <p className="mt-1.5 text-xs text-igniteRed">{state.errors.name}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="q-email" className="label-tech mb-2 block text-slate">
                            Email <span className="text-amber"> *</span>
                          </label>
                          <input
                            id="q-email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={onChange('email')}
                            placeholder="you@school.edu"
                            aria-invalid={!!state.errors.email}
                            className={inputClass('email')}
                          />
                          {state.errors.email && (
                            <p className="mt-1.5 text-xs text-igniteRed">{state.errors.email}</p>
                          )}
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="q-event" className="label-tech mb-2 block text-slate">
                            Event <span className="text-amber"> *</span>
                          </label>
                          <select
                            id="q-event"
                            name="event"
                            value={values.eventId}
                            onChange={onChange('eventId')}
                            className={`${inputClass('eventId')} appearance-none`}
                          >
                            {events.map((ev) => (
                              <option key={ev.id} value={ev.id} className="bg-midnight text-ice">
                                {ev.number} — {ev.title} ({ev.club})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="q-message" className="label-tech mb-2 block text-slate">
                            Your Query <span className="text-amber"> *</span>
                          </label>
                          <textarea
                            id="q-message"
                            name="message"
                            rows={5}
                            value={values.message}
                            onChange={onChange('message')}
                            placeholder={`Ask anything about ${selected ? selected.title : 'the event'} — schedule, teams, rules…`}
                            aria-invalid={!!state.errors.message}
                            className={`${inputClass('message')} resize-y`}
                          />
                          {state.errors.message && (
                            <p className="mt-1.5 text-xs text-igniteRed">{state.errors.message}</p>
                          )}
                        </div>
                      </div>

                      {state.status === 'unconfigured' && (
                        <p className="mt-6 border-l-2 border-amber bg-graphite/40 px-4 py-3 text-sm text-silver">
                          Queries are not configured yet. Meanwhile, write to us
                          directly at{' '}
                          <a className="text-amber underline" href={`mailto:${CONTACT_EMAIL}`}>
                            {CONTACT_EMAIL}
                          </a>
                          .
                        </p>
                      )}
                      {state.status === 'error' && (
                        <p className="mt-6 border-l-2 border-igniteRed bg-graphite/40 px-4 py-3 text-sm text-silver">
                          {state.message}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="btn-primary btn-primary-lg mt-7 w-full justify-center sm:w-auto"
                        disabled={state.status === 'loading'}
                      >
                        {state.status === 'loading' ? 'Sending…' : 'Send Query'}
                      </button>
                    </>
                  )}
                </form>
              </Reveal>
            </div>
        </div>
      </div>
    </section>
  )
}
