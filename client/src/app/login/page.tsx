'use client'
import React from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<div className={classNames(styles.login, roboto.className)}>
				<Image src={'/assets/images/dog.jpg'} alt="dog" width={100} height={100} />
				<span className={styles.login__header}>Login</span>
				<span className={styles.login__sub}>Enter your email and we'll send you a login code</span>
				<span className={styles.login__label}>Email</span>
				<input type="text" />
				<div className={styles.btn}>Continue</div>
			</div>
		</div>
	)
}

export default Page
