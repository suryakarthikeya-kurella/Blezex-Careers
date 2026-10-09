import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { accent: '#FF4D1C', ink: '#111111', paper: '#F7F6F2', line: '#E7E5DF', body: '#333333', muted: '#616161' },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: { card: '0 1px 2px rgba(17,17,17,0.05), 0 8px 24px rgba(17,17,17,0.07)', soft: '0 1px 2px rgba(17,17,17,0.06)' },
    },
  },
  plugins: [],
}
export default config
