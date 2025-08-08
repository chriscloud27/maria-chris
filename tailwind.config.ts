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
        'soft-white': '#F9F9F8',
        'sage-green': '#9FB2A6',
        'deep-olive': '#52675A',
        'elegant-black': '#1B1B1B',
        'pale-mint': '#DCE4DE',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
      },
    },
  },
  plugins: [],
}
export default config
