import { useAppSelector } from '@/redux/store'
import React, { FC } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'

const ThemesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const darkMode = useAppSelector(state => state.app.darkMode)
  const { theme: nextTheme } = useTheme()
  const darkModeFromNext = nextTheme === 'dark'
  return (
    <NextThemesProvider attribute="class" defaultTheme={darkModeFromNext ? 'dark' : 'light'}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { fontFamily: 'Poppins', colorPrimary: '#000' },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </NextThemesProvider>
  )
}

export default ThemesProvider
