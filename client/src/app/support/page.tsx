import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'

const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<div className={styles.pageTitle}>SUPPORT</div>
			<div className={styles.supportWrapper}>
				<span>ORDERS & PAYMENT</span>
				<span>SHIPPING</span>
				<span>RETURNS</span>
				<span>GIFT CARD</span>
			</div>
			<span className={classNames(styles.footer, roboto.className)}>
				We aim to ensure that our website content is user-friendly for everyone. If you encounter any difficulties
				accessing or navigating our site, please send us a message on Instagram
			</span>
		</div>
	)
}

export default Page
