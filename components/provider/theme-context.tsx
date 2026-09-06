'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const stored = localStorage.getItem('theme') as Theme | null
    
    if (stored) {
      setTheme(stored)
    }

    const updateResolvedTheme = () => {
      const newTheme = theme === 'system' 
        ? (mql.matches ? 'dark' : 'light')
        : theme
      setResolvedTheme(newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    updateResolvedTheme()
    mql.addEventListener('change', updateResolvedTheme)
    return () => mql.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
