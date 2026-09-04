import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        manrope: ['"Manrope", sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config