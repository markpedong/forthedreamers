import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import React from 'react'
import styles from './styles.module.scss'

const roboto = Roboto_Condensed({ weight: ['200', '300', '400', '500', '600', '800'], subsets: ['latin'] })

const Page = () => {
	return <div className={classNames(styles.mainWrapper, roboto.className)}>Page</div>
}

export default Page
