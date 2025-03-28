import type { Config } from 'tailwindcss'
import { TAddTailwindUtility } from './constants/types'

const { heroui } = require('@heroui/react')
const plugin = require('tailwindcss/plugin')

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
        primary: "black",
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    plugin(({ addComponents, addUtilities }: TAddTailwindUtility) => {
      addComponents({
        '.customButton1': {
          '@apply !bg-black !text-white': {},
          '.dark &': {
            '@apply !bg-white !text-black': {}
          }
        },
        '.customButton1Reverse': {
          '@apply !bg-white !text-black': {},
          '.dark &': {
            '@apply !bg-black !text-white': {}
          }
        },
        '.flexAllCenter': {
          '@apply flex items-center justify-center': {}
        }
      })
      // addUtilities({
      //   '.flex-all-center': {
      //     display: 'flex',
      //     'align-items': 'center',
      //     'justify-content': 'center'
      //   }
      // })
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
            'typography-1': '#F4F4F5'
          }
        }
      }
    })
  ]
} satisfies Config
