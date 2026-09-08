import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* subtle static star field */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        aria-hidden="true"
      >
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 137.5) % 100
          const y = (i * 89.3) % 100
          const r = (i % 3) * 0.4 + 0.3
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="#F5F7FA"
              opacity={0.2 + (i % 4) * 0.15}
            />
          )
        })}
        {/* disconnected orbital signal */}
        <circle cx="50%" cy="42%" r="60" stroke="#26303B" strokeWidth="1" fill="none" />
        <circle cx="50%" cy="42%" r="100" stroke="#26303B" strokeWidth="0.6" fill="none" opacity="0.6" />
        <circle cx="50%" cy="42%" r="3" fill="#FFB800" />
        <line x1="50%" y1="42%" x2="50%" y2="10%" stroke="#FFB800" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
      </svg>

      <div className="relative z-10">
        <p className="label-tech text-amber">// SIGNAL LOST</p>
        <h1 className="display-hero mt-4 text-ice text-[28vw] leading-none sm:text-[16rem]">
          404
        </h1>
        <p className="mt-2 max-w-md font-display text-lg text-silver sm:text-xl">
          The page you’re looking for doesn’t exist.
        </p>
        <Link to="/" className="btn-primary mt-10">
          Return to IGNITE
        </Link>
      </div>
    </main>
  )
}
