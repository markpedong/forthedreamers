'use client'

import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import ShippingModal from './components/shippingModal'

const roboto = Roboto_Condensed({ weight: ['200', '300', '400', '500', '600', '800'], subsets: ['latin'] })

const Products: FC = () => {
	return (
		<div className={styles.products__container}>
			<Image className={styles.products__img} src={'/assets/images/dog.jpg'} width={100} height={100} alt="dog" />
			<div className={styles.products__quantity}>1</div>
			<div className={styles.products__textContainer}>
				<div>
					<span>1996 Hoodie</span>
					<span>Medium</span>
				</div>
				<span className={styles.products__price}>₱ 1,590.00</span>
			</div>
		</div>
	)
}

const Page = () => {
	const [code, setCode] = useState('')
	const [modal, setModal] = useState(false)

	return (
		<div className={styles.mainWrapper}>
			<div className={styles.section1}>1</div>
			<div className={classNames(styles.productsWrapper, roboto.className)}>
				<div className={styles.products}>
					<Products />
					<Products />
					<Products />
					<Products />
					<Products />
					<Products />
					<Products />
				</div>
				<div className={styles.discount}>
					<input value={code} onChange={e => setCode(e.target.value)} placeholder="Discount code or gift card" />
					<motion.span className={styles.discount__btn} whileTap={{ scale: 0.9 }}>
						Apply
					</motion.span>
				</div>
				<div className={styles.price}>
					<span>Subtotal</span>
					<span>₱ 1,590.00</span>
					<span className={styles.price__shipping}>
						Shipping <HiOutlineQuestionMarkCircle onClick={() => setModal(true)} />
					</span>
					<AnimatePresence>
						{modal && (
							<motion.div
								initial={{
									y: 100,
									opacity: 0
								}}
								exit={{
									y: 100,
									opacity: 0
								}}
								animate={{
									y: 0,
									opacity: 1
								}}
							>
								<ShippingModal closeModal={() => setModal(false)} />
							</motion.div>
						)}
					</AnimatePresence>
					<span className={styles.price__enterShipping}>Enter Shipping address</span>
					<span className={styles.price__totalTitle}>Total</span>
					<div className={styles.price__total}>
						<span>PHP</span>
						<span>₱ 1,590.00</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
