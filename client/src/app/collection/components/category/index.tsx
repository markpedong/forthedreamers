import React, { FC } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'

const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Category: FC = () => {
	return (
		<div className={styles.categoryContainer}>
			<div className={styles.imgContainer}>
				<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
				<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
				<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
				<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
			</div>
			<span className={roboto.className}>Lorem ipsum dolor sit amet.</span>
		</div>
	)
}

export default Category
