'use client'

import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'
import ShippingModal from './components/shippingModal'
import { Question } from '@/components/page-components'
import { FaQuestionCircle } from 'react-icons/fa'

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
	const [selected, setSelected] = useState<number>()

	const handleSelect = (index: number) => {
		setSelected(index)
	}

	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<div className={styles.section1}>
				<div className={styles.header}>
					<Question question="Contact" />
					<span>Login</span>
				</div>
				<div className={styles.email}>
					<input type="text" placeholder="Email" className={styles.email__input} />
					<div className={styles.email__checkbox}>
						<input type="checkbox" id="check3" /> Email me with news and offers
						<label htmlFor="check3">
							<span className="fa fa-check" />
						</label>
					</div>
				</div>
				<div className={styles.delivery}>
					<Question question="Delivery" />
					<div className={styles.delivery__selectContainer}>
						<label>Country</label>
						<select name="country">
							<option value="">---</option>
							<option value="Philippines">Philippines</option>
						</select>
					</div>
				</div>
				<div className={styles.twoInputs}>
					<input type="text" placeholder="First Name" />
					<input type="text" placeholder="Last Name" />
				</div>
				<input
					type="text"
					className={styles.address}
					placeholder="Address (Please do not forget to include your Barangay)"
				/>
				<input type="text" className={styles.apartment} placeholder="Apartment, suite, etc. (optional)" />
				<div className={styles.twoInputs}>
					<input type="text" placeholder="Postal Code" />
					<input type="text" placeholder="City" />
				</div>
				<div className={styles.region}>
					<label>Region</label>
					<select name="country">
						<option value="">---</option>
						<option value="abra">Abra</option>
					</select>
				</div>
				<div className={styles.phone}>
					<input type="text" placeholder="Phone" />
					<FaQuestionCircle />
				</div>
				<div className={styles.saveInformation}>
					<input type="checkbox" id="check3" />
					Save this information for next time
					<label htmlFor="check3">
						<span className="fa fa-check" />
					</label>
				</div>
				<Question question="Shipping Method" className={styles.shipping} />
				<input
					type="text"
					className={styles.shippingMethod}
					placeholder="Enter your shipping address to view available shipping methods."
					disabled
				/>
				<Question question="Payment" className={styles.payment} />
				<span className={styles.paymentNote}>All transactions are secure and encrypted.</span>
				<Question question="Billing Address" className={styles.billing} />
				<Question question="Add Tip" className={styles.addTip} />
				<div className={styles.tip}>
					<span className={styles.tip__header}>Show your support for the team at For the Dreamers</span>
					<div className={styles.tip__content}>
						<div className={styles.tip__amountContainer}>
							{[2, 5, 10, 'None'].map((tip, index) => (
								<div
									key={index}
									className={selected === index ? styles.selected : ''}
									onClick={() => handleSelect(index)}
								>
									<span>{tip === 'None' ? tip : `${tip}%`}</span>
									<span>100.00</span>
								</div>
							))}
						</div>
						<span className={styles.tip__footer}>Thank you, we appreciate it.</span>
					</div>
				</div>
				<div className={styles.payNowBtn}>Pay Now</div>
				<div className={styles.rules}>
					<span>Shipping Policy</span>
					<span>Terms of Service</span>
				</div>
			</div>
			<div className={classNames(styles.productsWrapper, roboto.className)}>
				<div className={styles.products}>
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

					<span className={styles.price__enterShipping}>Enter Shipping address</span>
					<span className={styles.price__totalTitle}>Total</span>
					<div className={styles.price__total}>
						<span>PHP</span>
						<span>₱ 1,590.00</span>
					</div>
				</div>
			</div>
			<AnimatePresence>
				{modal && (
					<motion.div
						className="absolute top-0 left-0 size-full"
						initial={{ y: 100, opacity: 0 }}
						exit={{ y: 100, opacity: 0 }}
						animate={{
							y: 0,
							opacity: 1
						}}
					>
						<ShippingModal closeModal={() => setModal(false)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Page
