import { useEffect, useRef, useState } from 'react'

// Reveal-on-scroll wrapper. Respects prefers-reduced-motion via CSS.
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  id,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const delayClass =
    delay === 1
      ? 'reveal-delay-1'
      : delay === 2
        ? 'reveal-delay-2'
        : delay === 3
          ? 'reveal-delay-3'
          : ''

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${shown ? 'in-view' : ''} ${delayClass} ${className}`}
    >
      {children}
    </Tag>
  )
}
