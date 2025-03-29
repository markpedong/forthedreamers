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
        // primary: "var(--primary)",
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    plugin(({ addComponents, addUtilities }: TAddTailwindUtility) => {
      addComponents({
        // '.': {
        //   '@apply !bg-black !text-white': {},
        //   '.dark &': {
        //     '@apply !bg-white !text-black': {}
        //   }
        // },
        // '.Reverse': {
        //   '@apply !bg-white !text-black': {},
        //   '.dark &': {
        //     '@apply !bg-black !text-white': {}
        //   }
        // },
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
            'typography-1': '#3F3F46',
            // background: "#FFFFFF",
            // foreground: "#11181C",
            primary: {
              50: "#f6f6f6",
              100: "#e7e7e7",
              200: "#d1d1d1",
              300: "#b0b0b0",
              400: "#888888",
              500: "#333333", // Primary black color
              600: "#2d2d2d",
              700: "#1f1f1f",
              800: "#1a1a1a",
              900: "#0f0f0f",
              DEFAULT: "black",
              foreground: "white"
            }
          }
        },
        dark: {
          colors: {
            'typography-1': '#F4F4F5',
            // background: "#FFFFFF",
            // foreground: "#11181C",
            primary: {
              50: "#f6f6f6",
              100: "#e7e7e7",
              200: "#d1d1d1",
              300: "#b0b0b0",
              400: "#888888",
              500: "#333333", // Primary black color
              600: "#2d2d2d",
              700: "#1f1f1f",
              800: "#1a1a1a",
              900: "#0f0f0f",
              DEFAULT: "white",
              foreground: "black"
            }
          }
        }
      }
    })
  ]
} satisfies Config
