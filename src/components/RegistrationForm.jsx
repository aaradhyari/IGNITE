import { useState } from 'react'
import Reveal from './Reveal.jsx'
import {
  REGISTRATION_API_URL,
  isRegistrationConfigured,
} from '../config/registration.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(\+91[-\s]?)?[6-9]\d{9}$/

function buildFields(isTeam) {
  if (isTeam) {
    return [
      { name: 'teamName', label: 'Team Name', required: true, ph: 'Nova Labs' },
      { name: 'captainName', label: 'Captain Name', required: true, ph: 'Aarav Sharma' },
      { name: 'class', label: 'Class', required: true, ph: 'XI' },
      { name: 'house', label: 'House', required: true, ph: 'Emerald' },
      { name: 'email', label: 'Email', required: true, type: 'email', ph: 'team@school.edu' },
      { name: 'phone', label: 'Phone', required: true, type: 'tel', ph: '9876543210' },
      { name: 'member2', label: 'Member 2', required: false, ph: 'Optional' },
      { name: 'member3', label: 'Member 3', required: false, ph: 'Optional' },
      { name: 'member4', label: 'Member 4', required: false, ph: 'Optional' },
    ]
  }
  return [
    { name: 'participantName', label: 'Participant Name', required: true, ph: 'Diya Patel' },
    { name: 'class', label: 'Class', required: true, ph: 'X' },
    { name: 'house', label: 'House', required: true, ph: 'Sapphire' },
    { name: 'email', label: 'Email', required: true, type: 'email', ph: 'you@school.edu' },
    { name: 'phone', label: 'Phone', required: true, type: 'tel', ph: '9876543210' },
  ]
}

const EMPTY = { status: 'idle', errors: {} }

export default function RegistrationForm({ event }) {
  const isTeam = event.format !== 'Individual'
  const fields = buildFields(isTeam)
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ''])),
  )
  const [state, setState] = useState(EMPTY)

  const validate = () => {
    const errors = {}
    fields.forEach((f) => {
      const v = (values[f.name] || '').trim()
      if (f.required && !v) {
        errors[f.name] = 'Required'
        return
      }
      if (f.name === 'email' && v && !EMAIL_RE.test(v)) {
        errors[f.name] = 'Enter a valid email'
      }
      if (f.name === 'phone' && v && !PHONE_RE.test(v)) {
        errors[f.name] = 'Enter a valid 10-digit mobile'
      }
    })
    return errors
  }

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
    const errors = validate()
    if (Object.keys(errors).length) {
      setState({ status: 'idle', errors })
      return
    }

    // Honest handling: if the Apps Script URL is not configured,
    // we must NOT fake a successful registration.
    if (!isRegistrationConfigured()) {
      setState({
        status: 'unconfigured',
        errors: {},
      })
      return
    }

    setState({ status: 'loading', errors: {} })
    const payload = {
      eventId: event.id,
      event: event.title,
      club: event.club,
      ...values,
      submittedAt: new Date().toISOString(),
    }

    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 12000)
      const res = await fetch(REGISTRATION_API_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      })
      clearTimeout(t)
      if (!res.ok) throw new Error('bad status ' + res.status)
      setState({ status: 'success', errors: {} })
    } catch (err) {
      setState({
        status: 'error',
        errors: {},
        message:
          'We could not reach the registration service. Please try again shortly.',
      })
    }
  }

  const inputClass = (name) =>
    `w-full bg-midnight px-4 py-3 text-ice placeholder:text-slate border outline-none transition-colors duration-300 focus:border-amber ${
      state.errors[name] ? 'border-igniteRed' : 'border-charcoal'
    }`

  return (
    <section
      id="register"
      className="relative mx-auto max-w-editorial scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label-tech text-amber">// Join</p>
            <h2 className="display-hero mt-4 text-ice text-4xl sm:text-5xl">
              Register
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate">
              Secure your place at{' '}
              <span className="text-ice">{event.title}</span>. {isTeam ? 'Form a team of 2–4 and ' : ''}complete the details below.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <Reveal delay={1}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="glass p-6 sm:p-9"
              aria-label={`Register for ${event.title}`}
            >
              {state.status === 'success' ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber/60">
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
                    You’re on the list.
                  </h3>
                  <p className="mt-3 text-silver">
                    Registration for {event.title} received. We’ll be in touch
                    at the email you provided.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {fields.map((f) => (
                      <div
                        key={f.name}
                        className={f.name === 'teamName' || f.name === 'email' ? 'sm:col-span-2' : ''}
                      >
                        <label
                          htmlFor={f.name}
                          className="label-tech mb-2 block text-slate"
                        >
                          {f.label}
                          {f.required && (
                            <span className="text-amber"> *</span>
                          )}
                        </label>
                        <input
                          id={f.name}
                          name={f.name}
                          type={f.type || 'text'}
                          value={values[f.name]}
                          onChange={onChange(f.name)}
                          placeholder={f.ph}
                          aria-invalid={!!state.errors[f.name]}
                          aria-describedby={
                            state.errors[f.name] ? `${f.name}-err` : undefined
                          }
                          className={inputClass(f.name)}
                        />
                        {state.errors[f.name] && (
                          <p
                            id={`${f.name}-err`}
                            className="mt-1.5 text-xs text-igniteRed"
                          >
                            {state.errors[f.name]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {state.status === 'unconfigured' && (
                    <p className="mt-6 border-l-2 border-amber bg-graphite/40 px-4 py-3 text-sm text-silver">
                      Registration is not configured yet.
                    </p>
                  )}
                  {state.status === 'error' && (
                    <p className="mt-6 border-l-2 border-igniteRed bg-graphite/40 px-4 py-3 text-sm text-silver">
                      {state.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn-primary mt-7 w-full justify-center sm:w-auto"
                    disabled={state.status === 'loading'}
                  >
                    {state.status === 'loading'
                      ? 'Submitting…'
                      : `Register for ${event.title}`}
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
