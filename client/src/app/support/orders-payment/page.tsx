import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import Image from 'next/image'
import classNames from 'classnames'

const roboto = Roboto_Condensed({ weight: ['400', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<div className={styles.pageTitle}>ORDERS & PAYMENT</div>
			<div className={classNames(styles.question, roboto.className)}>WHAT PAYMENT METHODS DO YOU ACCEPT?</div>
			<span className={classNames(styles.bullet, roboto.className)}>
				We support a wide range of different payment methods. Our payment options include Credit/Debit card, E-Wallets, Online banking.
			</span>
			<Image className={styles.payments} src={'/assets/images/payments.webp'} alt="payments" width={500} height={1000} />
			<span className={classNames(styles.question, roboto.className)}>CAN I AMEND OR CANCEL MY ORDER?</span>
			<ul className={roboto.className}>
				<li>
					Once an order has been placed in the system, we are unable to make any amendments. Our packing process begins shortly after an order is placed, which means we cannot add
					items or modify the size, design, or color of an order. We can cancel the order instead so you can place a new one with the correct item. Once the cancellation is
					processed, your refund will be credited back to the original payment method.
				</li>
				<li>
					Please get in touch with us on Instagram at <span className="underline">@forthedreamers</span> to arrange this.
				</li>
			</ul>
		</div>
	)
}

export default Page
