/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core neutral system
        obsidian: '#07090D',
        midnight: '#0D1117',
        graphite: '#121820',
        steel: '#171F29',
        charcoal: '#26303B',
        ice: '#F5F7FA',
        silver: '#A7B0BC',
        slate: '#66717E',
        // Brand + accents
        amber: '#FFB800',
        gold: '#FFD166',
        electric: '#5B8CFF',
        supernova: '#38D9FF',
        igniteRed: '#FF5C5C',
        photo: '#E8E8E8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.35em',
        wide2: '0.18em',
      },
      maxWidth: {
        editorial: '1440px',
      },
      transitionTimingFunction: {
        observatory: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatySlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.6)', opacity: '0.9' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        floatySlow: 'floatySlow 11s ease-in-out infinite',
        pulseRing: 'pulseRing 3s ease-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
