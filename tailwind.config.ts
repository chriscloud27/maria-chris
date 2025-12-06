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
        // Heading Fonts (Serif, elegant, festlich)
        'heading': ['var(--font-playfair-display)', 'var(--font-cormorant-garamond)', 'serif'],
        'serif': ['var(--font-playfair-display)', 'serif'],
        'serif-alt': ['var(--font-cormorant-garamond)', 'serif'],
        
        // Body Fonts (Sans-Serif, modern, klar)
        'sans': ['var(--font-inter)', 'var(--font-nunito)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
        'body-alt': ['var(--font-nunito)', 'sans-serif'],
        
        // Accent Fonts (Script/Handwritten)
        'script': ['var(--font-great-vibes)', 'var(--font-dancing-script)', 'cursive'],
        'accent': ['var(--font-great-vibes)', 'cursive'],
        'accent-alt': ['var(--font-dancing-script)', 'cursive'],

        // Monospace
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
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
