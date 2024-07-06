'use client'
import classNames from 'classnames'
import React, { FC } from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Header: FC<{ arr: string[] }> = ({ arr }) => {
	return (
		<div className={classNames(styles.header, roboto.className)}>
			{arr?.map((q, i) => (
				<>
					<div>{q}</div>
					{i !== arr.length - 1 && <span>/</span>}
				</>
			))}
		</div>
	)
}

export default Header
