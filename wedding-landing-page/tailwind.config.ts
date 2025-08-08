import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-playfair-display)"],
        script: ["var(--font-great-vibes)"],
        sans: ["var(--font-lato)"],
      },
      colors: {
        gold: '#C8A760',
        purple: '#7E4C9F',
        green: '#2E7D64',
        blue: '#345C9C',
        white: '#F9F7F3',
        'dark-gray': '#333333',
        red: '#B83342',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  plugins: [],
}
export default config
