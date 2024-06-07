import React from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'

const roboto = Roboto_Condensed({ weight: ['300', '400', '600'], subsets: ['latin'] })

const Product = () => {
	return (
		<div className={styles.productContainer}>
			<Image src={'/assets/images/dog.jpg'} alt="" height={150} width={150} />
			<div className={classNames(styles.textContainer, roboto.className)}>
				<span>Lorem ipsum dolor sit.</span>
				<span>₱2,290.00</span>
				<span>Available Colors</span>
			</div>
		</div>
	)
}

export default Product
