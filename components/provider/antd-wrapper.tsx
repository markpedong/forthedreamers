import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { useIsClient } from '@uidotdev/usehooks'
import { useTheme } from 'next-themes'
import enUS from 'antd/locale/en_US'
import dayjs from 'dayjs'
import { getCssVarHex } from '@/utils/helper'
import '@ant-design/v5-patch-for-react-19'
import { unstableSetRender } from 'antd'
import { createRoot } from 'react-dom/client'

unstableSetRender((node, container) => {
  //@ts-ignore
  container._reactRoot ||= createRoot(container)
  //@ts-ignore
  const root = container._reactRoot
  root.render(node)
  return async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    root.unmount()
  }
})

dayjs.locale('en')

const AntdWrapper: FC<PropsWithChildren> = ({children}) => {
  const isClient = useIsClient()
  const {resolvedTheme: themeMode} = useTheme()
  const isDark = themeMode === 'dark'

  const [colors, setColors] = useState({
    primary: '#000',
    primaryForeground: '#fff',
    secondary: '#000',
    secondaryForeground: '#fff'
  })

  useEffect(() => {
    if (!isClient) return

    const updateColors = () => {
      setColors({
        primary: getCssVarHex('--primary') || '#000',
        primaryForeground: getCssVarHex('--primary-foreground') || '#fff',
        secondary: getCssVarHex('--secondary') || '#000',
        secondaryForeground: getCssVarHex('--secondary-foreground') || '#fff'
      })
    }

    const raf = requestAnimationFrame(updateColors)

    return () => cancelAnimationFrame(raf)
  }, [themeMode, isClient])

  if (!isClient) return null

  return (
    <div>
      <AntdRegistry>
        <ConfigProvider
          locale={enUS}
          theme={{
            token: {
              fontFamily: 'Geist',
              colorPrimary: colors.primary,
              colorPrimaryHover: colors.primary,
              colorPrimaryTextHover: colors.primaryForeground,
              colorTextLightSolid: colors.primaryForeground,
              colorTextSecondary: colors.secondary
            },
            algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </div>
  )
}

export default AntdWrapper
