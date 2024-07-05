import classNames from 'classnames'
import { Poppins } from 'next/font/google'
import React, { FC } from 'react'
import styles from './styles.module.scss'

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

const PageTitle: FC<{ title: string }> = ({ title }) => {
	return <div className={classNames(styles.pageTitle, poppins.className)}>{title}</div>
}

export default PageTitle
