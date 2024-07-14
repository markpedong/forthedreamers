'use client'

import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import { PageTitle } from '@/components/page-components'
import Image from 'next/image'
import { FaMinus, FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const ProductContainer: FC = () => (
	<div className={styles.section__productContainer}>
		<Image src="/assets/images/dog.jpg" width={100} height={100} alt="picture" />
		<div className={styles.section__textContainer}>
			<span>Classic Hoodie</span>
			<span>SIZE: MEDIUM</span>
		</div>
	</div>
)

const QuantityContainer: FC = () => {
	const [quantity, setQuantity] = useState(1)

	return (
		<div className={styles.quantityContainer}>
			<div className="flex items-center gap-3">
				<div className={styles.addMinusContainer}>
					<FaMinus onClick={() => setQuantity(qty => (qty > 1 ? qty - 1 : qty))} />
					<span className={styles.qty}>{quantity}</span>
					<FaPlus onClick={() => setQuantity(qty => (qty < 10 ? (qty += 1) : qty))} />
				</div>
				<FaRegTrashAlt color="red" />
			</div>
			<span>₱ 1,590.00</span>
		</div>
	)
}

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<PageTitle title="Your Cart" medium />
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
				</div>
				<div className={styles.section}>
					<div className={styles.section__title}>
						<span>Quantity</span>
						<span>Total</span>
					</div>
					<div className={styles.section__quantityWrapper}>
						<QuantityContainer />
						<QuantityContainer />
						<QuantityContainer />
						<QuantityContainer />
						<QuantityContainer />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
