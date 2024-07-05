'use client'

import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/page-title'

const roboto = Roboto_Condensed({ weight: ['300', '500', '800'], subsets: ['latin'] })

const Page = () => {
	const { push } = useRouter()

	return (
		<div className={styles.mainWrapper}>
			<PageTitle title="SUPPORT" />
			<div className={styles.supportWrapper}>
				<span onClick={() => push('/support/orders-payment')}>ORDERS & PAYMENT</span>
				<span onClick={() => push('/support/shipping')}>SHIPPING</span>
				<span onClick={() => push('/support/returns')}>RETURNS</span>
				<span onClick={() => push('/support/gift-card')}>GIFT CARD</span>
			</div>
			<span className={classNames(styles.footer, roboto.className)}>
				We aim to ensure that our website content is user-friendly for everyone. If you encounter any difficulties accessing or navigating our site, please send us a message on
				Instagram <span className="font-[800]">@forthedreamers</span>
			</span>
		</div>
	)
}

export default Page
