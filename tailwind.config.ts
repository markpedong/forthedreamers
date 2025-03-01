import type { Config } from 'tailwindcss'

const { heroui } = require('@heroui/react')
const plugin = require("tailwindcss/plugin");

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
        foreground: 'var(--foreground)',
      }
    }
  },
  darkMode: 'class',
  plugins: [
    plugin(({ addComponents }: any) => {
      addComponents({
        ".customButton1": {
          "@apply bg-black text-white": {},
          ".dark &": {
            "@apply bg-white text-black": {},
          },
        },
      });
    }),
    heroui({
      themes: {
        light: {
          colors: {
            'typography-1': '#3F3F46'
          }
        },
        dark: {
          colors: {
            'typography-1': '#F4F4F5',
          }
        }
      }
    })
  ]
} satisfies Config
