import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { REGISTRATION_API_URL } from '../config/registration.js'

const KEY_STORE = 'ignite-admin-key'

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORE) || '')
  const [draftKey, setDraftKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [openRow, setOpenRow] = useState(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(async (k) => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch(
        `${REGISTRATION_API_URL}?action=list-queries&key=${encodeURIComponent(k)}`,
      )
      if (!res.ok) throw new Error('bad status ' + res.status)
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'forbidden')
      setQueries(data.queries || [])
      setAuthed(true)
      sessionStorage.setItem(KEY_STORE, k)
    } catch (e) {
      setAuthed(false)
      sessionStorage.removeItem(KEY_STORE)
      setError(
        'Could not load queries — wrong passcode, or the script needs a New version deploy.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (key) load(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unlock = (e) => {
    e.preventDefault()
    const k = draftKey.trim()
    if (!k) return
    setKey(k)
    load(k)
  }

  const logout = () => {
    setKey('')
    setDraftKey('')
    setAuthed(false)
    setQueries([])
    sessionStorage.removeItem(KEY_STORE)
  }

  const openReply = (q) => {
    setOpenRow(q.row)
    setSubject(`Re: your query about ${q.event || 'IGNITE'}`)
    setBody(`Hi ${q.name || 'there'},\n\n`)
    setNotice('')
  }

  const sendReply = async (q) => {
    if (!body.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(REGISTRATION_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          action: 'send-reply',
          key,
          row: String(q.row),
          to: q.email,
          subject: subject.trim() || `Re: your query about ${q.event || 'IGNITE'}`,
          body: body.trim(),
        }),
      })
      void res
      // no-cors is opaque — treat "no network error" as sent (proven pattern)
      setQueries((qs) =>
        qs.map((x) =>
          x.row === q.row ? { ...x, replied: 'Replied just now' } : x,
        ),
      )
      setOpenRow(null)
      setNotice(`Reply sent to ${q.email}. Marked as replied in the sheet.`)
    } catch (e) {
      setError('Could not send the reply. Check connection and retry.')
    } finally {
      setSending(false)
    }
  }

  const pending = queries.filter((q) => !q.replied).length

  return (
    <div className="relative mx-auto min-h-screen max-w-editorial px-5 py-14 sm:px-8 lg:px-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="label-tech text-amber">// Crew only</p>
          <h1 className="display-hero mt-3 text-ice text-4xl sm:text-5xl">
            Query desk.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {authed && (
            <>
              <button type="button" className="btn-ghost" onClick={() => load(key)} disabled={loading}>
                {loading ? 'Loading…' : 'Refresh'}
              </button>
              <button type="button" className="btn-ghost" onClick={logout}>
                Lock
              </button>
            </>
          )}
          <Link to="/" className="btn-ghost">
            Site
          </Link>
        </div>
      </div>

      {!authed ? (
        <form
          onSubmit={unlock}
          className="mx-auto mt-14 max-w-sm border border-charcoal bg-graphite/40 p-6 sm:p-8"
        >
          <label htmlFor="admin-key" className="label-tech mb-2 block text-slate">
            Desk passcode
          </label>
          <input
            id="admin-key"
            type="password"
            value={draftKey}
            onChange={(e) => setDraftKey(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            className="w-full border border-charcoal bg-midnight px-4 py-3 text-ice outline-none transition-colors duration-300 placeholder:text-slate focus:border-amber"
          />
          {error && <p className="mt-3 text-sm text-igniteRed">{error}</p>}
          <button
            type="submit"
            className="btn-primary mt-6 w-full justify-center"
            disabled={loading}
          >
            {loading ? 'Unlocking…' : 'Unlock desk'}
          </button>
        </form>
      ) : (
        <div className="mt-10">
          <p className="label-tech text-slate">
            {queries.length} total · {pending} awaiting reply
          </p>
          {notice && (
            <p className="mt-4 border-l-2 border-amber bg-graphite/40 px-4 py-3 text-sm text-silver">
              {notice}
            </p>
          )}
          {error && (
            <p className="mt-4 border-l-2 border-igniteRed bg-graphite/40 px-4 py-3 text-sm text-silver">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {queries.length === 0 && !loading && (
              <p className="border border-charcoal bg-graphite/40 px-5 py-8 text-center text-sm text-slate">
                No queries yet. New questions from the contact form will appear here.
              </p>
            )}
            {queries.map((q) => (
              <article
                key={q.row}
                className="border border-charcoal bg-graphite/40 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h2 className="font-display text-lg font-bold text-ice">
                    {q.name || 'Unnamed'}
                  </h2>
                  <span className="label-tech text-amber">{q.event || 'General'}</span>
                  {q.replied ? (
                    <span className="label-tech border border-amber/50 px-2 py-1 text-amber">
                      ✓ {q.replied}
                    </span>
                  ) : (
                    <span className="label-tech border border-charcoal px-2 py-1 text-slate">
                      Awaiting reply
                    </span>
                  )}
                  <span className="num-tech ml-auto text-xs text-slate">
                    {fmtDate(q.submittedAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate break-all">{q.email}</p>
                <p className="mt-3 border-l-2 border-charcoal pl-4 text-sm leading-relaxed text-silver">
                  {q.message}
                </p>

                {openRow === q.row ? (
                  <div className="mt-5 border-t border-charcoal pt-5">
                    <label className="label-tech mb-2 block text-slate" htmlFor={`subj-${q.row}`}>
                      Subject
                    </label>
                    <input
                      id={`subj-${q.row}`}
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-charcoal bg-midnight px-4 py-3 text-ice outline-none transition-colors duration-300 focus:border-amber"
                    />
                    <label className="label-tech mb-2 mt-4 block text-slate" htmlFor={`body-${q.row}`}>
                      Reply — sent from aaradhyar000@gmail.com
                    </label>
                    <textarea
                      id={`body-${q.row}`}
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full resize-y border border-charcoal bg-midnight px-4 py-3 text-ice outline-none transition-colors duration-300 focus:border-amber"
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={sending || !body.trim()}
                        onClick={() => sendReply(q)}
                      >
                        {sending ? 'Sending…' : 'Send reply'}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setOpenRow(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  !q.replied && (
                    <button
                      type="button"
                      className="btn-ghost mt-5"
                      onClick={() => openReply(q)}
                    >
                      Reply
                    </button>
                  )
                )}
                {q.replied && openRow !== q.row && (
                  <button
                    type="button"
                    className="btn-ghost mt-5"
                    onClick={() => openReply(q)}
                  >
                    Reply again
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
