// Tailwind v4 compatible config (for tooling that expects a config file)
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
