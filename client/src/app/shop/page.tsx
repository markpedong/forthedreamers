import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { FaFilter } from 'react-icons/fa'
import { FaAngleDown, FaArrowRight } from 'react-icons/fa6'
import Product from '@/components/product'
import Image from 'next/image'
import { PageTitle } from '@/components/page-components'
import Header from '@/components/header'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<Header arr={['HOME', 'SHOP', 'PRODUCTS']} />
			<PageTitle title="PRODUCTS" />
			<div className={classNames(styles.filterContainer, roboto.className)}>
				<div>
					<FaFilter />
					<span>FILTER AND SORT</span>
				</div>
				<div>
					<span className={styles.sort}>ALPHABETICALLY, A-Z</span>
					<FaAngleDown />
					<span>152 PRODUCTS</span>
				</div>
			</div>
			<div className={styles.productWrapper}>
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
			</div>
			<div className={classNames(styles.pagination, roboto.className)}>
				<span>1</span>
				<span>2</span>
				<span>3</span>
				<span>4</span>
				<span>
					<FaArrowRight />
				</span>
			</div>
			<div className={styles.crowdWrapper}>
				<span className={styles.crowdTitle}>CROWD FAVORITES</span>
				<div className={styles.crowdItemsContainer}>
					<div>
						<Image src={'/assets/images/dog.jpg'} width={500} height={500} alt="img1" />
						<span>LOGO1</span>
					</div>
					<div>
						<Image src={'/assets/images/dog.jpg'} width={500} height={500} alt="img1" />
						<span>LOGO2</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
