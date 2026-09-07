'use client'

import {useAppDispatch, useAppSelector} from '@/lib/hooks/use-app-store'
import {setTheme} from '@/lib/store'

export const useTheme = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.app.theme)
  const resolvedTheme = useAppSelector(state => state.app.resolvedTheme)

  return {
    theme,
    resolvedTheme,
    setTheme: (value: typeof theme) => dispatch(setTheme(value))
  }
}
