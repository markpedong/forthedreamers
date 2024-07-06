'use client'

import React, { FC } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'

const roboto = Roboto_Condensed({ weight: ['300', '400', '600'], subsets: ['latin'] })

const Product: FC<{ className?: string }> = props => {
	const { push } = useRouter()
	return (
		<div className={classNames(styles.productContainer, props.className)}>
			{/* pass id here in the future */}
			<Image onClick={() => push(`/shop/123123`)} src={'/assets/images/dog.jpg'} alt="" height={150} width={150} />
			<div className={classNames(styles.textContainer, roboto.className)}>
				{/* pass id here in the future */}
				<span onClick={() => push(`/shop/123123`)}>Lorem ipsum dolor sit.</span>
				<span>₱2,290.00</span>
				<span>Available Colors</span>
			</div>
		</div>
	)
}

export default Product
