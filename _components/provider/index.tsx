'use client'

import { HeroUIProvider } from '@heroui/react'
import React, { FC } from 'react'

type Props = {
	children: React.ReactNode
}

const Provider: FC<Props> = ({ children }) => {
	return <HeroUIProvider>{children}</HeroUIProvider>
}

export default Provider
