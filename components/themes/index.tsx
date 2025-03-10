import { useAppSelector } from '@/redux/store'
import React, { FC } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'

const ThemesProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const darkMode = useAppSelector(state => state.app.darkMode)

  return (
    <NextThemesProvider attribute="class" defaultTheme={darkMode ? 'dark' : 'light'}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { fontFamily: 'Sora', colorPrimary: '#000' },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </NextThemesProvider>
  )
}

export default ThemesProvider
