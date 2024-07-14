'use client'

import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import { PageTitle } from '@/components/page-components'
import Image from 'next/image'
import { FaMinus, FaPlus, FaRegTrashAlt } from 'react-icons/fa'
import { useWindowSize } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Product from '@/components/product'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const CheckoutSection = () => {
	const { push } = useRouter()
	const [addNote, setAddNote] = useState(false)
	const ToggleIcon = addNote ? FaMinus : FaPlus

	return (
		<div className={styles.section__footer}>
			<div className={styles.section__addNotesContainer}>
				<span className={styles.section__footerTitle}>Add Notes</span>
				<ToggleIcon onClick={() => setAddNote(!addNote)} />
			</div>
			<AnimatePresence>
				{addNote && (
					<motion.div
						className={styles.addNoteContainer}
						initial={{ height: 0, opacity: 0 }}
						exit={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
					>
						<textarea rows={4} />
					</motion.div>
				)}
			</AnimatePresence>
			<div className={styles.checkbox}>
				<input type="checkbox" id="agree_checkbox" /> I agree with the{' '}
				<span className="underline underline-offset-4" onClick={() => push('/support/terms-of-service')}>
					terms and conditions
				</span>
				<label htmlFor="agree_checkbox">
					<span className="fa fa-check" />
				</label>
			</div>
			<div className={styles.btn}>checkout • ₱1,590.00</div>
			<div className={styles.footerTxt}>
				Taxes and{' '}
				<span className="underline underline-offset-4" onClick={() => push('/support/shipping')}>
					shipping
				</span>{' '}
				calculated at checkout
			</div>
		</div>
	)
}

const ProductContainer: FC = () => {
	const { width } = useWindowSize()

	return (
		<div className={styles.section__productContainer}>
			<Image src="/assets/images/dog.jpg" width={100} height={100} alt="picture" />
			<div className={styles.section__textContainer}>
				<span>Classic Hoodie</span>
				<span>SIZE: MEDIUM</span>
				{width! < 993 && <QuantityContainer />}
			</div>
		</div>
	)
}

const QuantityContainer: FC = () => {
	const [quantity, setQuantity] = useState(1)

	return (
		<div className="flex items-center gap-3">
			<div className={styles.addMinusContainer}>
				<FaMinus onClick={() => setQuantity(qty => (qty > 1 ? qty - 1 : qty))} />
				<span className={styles.qty}>{quantity}</span>
				<FaPlus onClick={() => setQuantity(qty => (qty < 10 ? (qty += 1) : qty))} />
			</div>
			<FaRegTrashAlt color="red" />
		</div>
	)
}

const Page = () => {
	const { width } = useWindowSize()

	return (
		<div className={roboto.className}>
			<div className={styles.mainWrapper}>
				<PageTitle title="Your Cart" medium className="!capitalize" />
				<div className={styles.cartWrapper}>
					<div className={styles.section}>
						<span className={styles.section__title}>Product</span>
						<div className={styles.section__productWrapper}>
							<ProductContainer />
							<ProductContainer />
							<ProductContainer />
							<ProductContainer />
							<ProductContainer />
						</div>
						<div className={styles.section__footer}>
							<span className={`underline underline-offset-4 ${width! < 993 && 'hidden'}`}>Continue Shopping</span>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.section__title}>
							<span className={`${width! < 993 && 'invisible'}`}>Quantity</span>
							<span className={styles.section__footerTitle}>Total</span>
						</div>
						<div className={styles.section__quantityWrapper}>
							<div className={styles.quantityContainer}>
								{width! > 992 && <QuantityContainer />}
								<span>₱ 1,590.00</span>
							</div>
							<div className={styles.quantityContainer}>
								{width! > 992 && <QuantityContainer />}
								<span>₱ 1,590.00</span>
							</div>
							<div className={styles.quantityContainer}>
								{width! > 992 && <QuantityContainer />}
								<span>₱ 1,590.00</span>
							</div>
							<div className={styles.quantityContainer}>
								{width! > 992 && <QuantityContainer />}
								<span>₱ 1,590.00</span>
							</div>
							<div className={styles.quantityContainer}>
								{width! > 992 && <QuantityContainer />}
								<span>₱ 1,590.00</span>
							</div>
						</div>
						{width! > 992 && <CheckoutSection />}
					</div>
				</div>
				{width! < 993 && <CheckoutSection />}
			</div>
			<PageTitle title="You may also like" className="!capitalize !text-center !mt-14" medium />
			<div className="text-center mb-10">Describe your featured collection here</div>
			<div className={styles.suggestionsContainer}>
				<Product />
				<Product />
				<Product />
				<Product />
			</div>
			<PageTitle title="Recently viewed products" className="!capitalize !text-center !mt-14" medium />
			<div className="text-center mb-10"> Describe your recently viewed products here</div>
			<div className={styles.suggestionsContainer}>
				<Product />
				<Product />
				<Product />
				<Product />
			</div>
		</div>
	)
}

export default Page
