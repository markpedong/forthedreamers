'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks/use-app-store'
import { resolveTheme, setTheme } from '@/redux/store'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.app.theme)

  return {
    theme,
    resolvedTheme: resolveTheme(theme),
    setTheme: (value: typeof theme) => dispatch(setTheme(value))
  }
}
