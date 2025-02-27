import type { Config } from 'tailwindcss'

const { heroui } = require('@heroui/react')
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            'typography-1': '#3F3F46'
          }
        },
        dark: {
          colors: {
            'typography-1': '#F4F4F5'
          }
        }
      }
    })
  ]
} satisfies Config
