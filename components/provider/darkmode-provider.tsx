import { useAppSelector } from '@/redux/store'
import React, { FC } from 'react'
import NavBar from '../navbar'
import classNames from 'classnames'

type Props = {
	children: React.ReactNode
}

const DarkModeProvider: FC<Props> = ({ children }) => {
	const darkMode = useAppSelector(s => s.app.darkMode)
	return (
		<main
			className={classNames('text-foreground bg-background', {
				dark: darkMode
			})}
		>
			<NavBar />
			{children}
		</main>
	)
}

export default DarkModeProvider
