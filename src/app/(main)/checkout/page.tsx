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
import { FaChevronDown } from 'react-icons/fa'
import Inputs from './components/inputs'
import { useWindowSize } from '@uidotdev/usehooks'

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
	const [address, setAddress] = useState('')
	const [summary, setSummary] = useState(false)
	const { width } = useWindowSize()
	const handleSelect = (index: number) => {
		setSelected(index)
	}

	return (
		<>
			<div className={classNames(styles.mainWrapper, roboto.className)}>
				<div className={styles.section1}>
					<div className={styles.header}>
						<Question question="Contact" />
						<span>Login</span>
					</div>
					<Inputs />
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
					<div className={styles.radioContainer}>
						<label className={classNames({ [styles.activeAddress]: address === '1' })}>
							<input type="radio" value="1" checked={address === '1'} onChange={() => setAddress('1')} />
							<span className={roboto.className}>Same as shipping address</span>
						</label>
						<label className={classNames({ [styles.activeAddress]: address === '2' })}>
							<input type="radio" value="2" checked={address === '2'} onChange={() => setAddress('2')} />
							<span className={roboto.className}>Use a different billing address</span>
						</label>
					</div>
					<AnimatePresence>
						{address === '2' && (
							<motion.div
								initial={{ opacity: 0, height: '0' }}
								exit={{ opacity: 0, height: '0' }}
								animate={{ opacity: 1, height: 'auto', transition: { duration: 0.2, ease: 'easeOut' } }}
								className={styles.newBillingAddress}
							>
								<Inputs />
							</motion.div>
						)}
					</AnimatePresence>
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
						<span onClick={() => setModal(true)}>Shipping Policy</span>
						<span>Terms of Service</span>
					</div>
				</div>
				<div className={classNames(styles.productsWrapper, roboto.className)}>
					<div className={styles.showSummary}>
						<div className="flex gap-2 items-center text-[0.9rem]" onClick={() => setSummary(!summary)}>
							<span>Show order summary</span>{' '}
							<FaChevronDown size={10} className={`transition-all rotate-${summary ? '180' : '0'}`} />
						</div>
						<div className={styles.price__total}>
							<span>PHP</span>
							<span>₱ 1,590.00</span>
						</div>
					</div>
					<AnimatePresence>
						{(width! > 993 || (width! <= 993 && summary)) && (
							<motion.div
								initial={width! > 993 ? {} : { opacity: 0, height: 0, y: -10 }}
								animate={width! > 993 ? {} : { opacity: 1, height: 'auto', y: 0 }}
								exit={width! > 993 ? {} : { opacity: 0, height: 0, y: -10 }}
								transition={width! > 993 ? {} : { duration: 0.3 }}
							>
								<div className={styles.products}>
									<Products />
									<Products />
								</div>
								<div className={styles.discount}>
									<input
										value={code}
										onChange={e => setCode(e.target.value)}
										placeholder="Discount code or gift card"
									/>
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
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			<AnimatePresence>{modal && <ShippingModal closeModal={() => setModal(false)} />}</AnimatePresence>
		</>
	)
}

export default Page
