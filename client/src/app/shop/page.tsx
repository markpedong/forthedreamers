import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { FaFilter } from 'react-icons/fa'
import { FaAngleDown, FaArrowRight } from 'react-icons/fa6'
import Product from '@/components/product'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<div className={classNames(styles.header, roboto.className)}>
				<span>HOME</span>
				<span>SHOP</span>
				<span>PRODUCTS</span>
			</div>
			<div className={styles.pageTitle}>PRODUCTS</div>
			<div className={classNames(styles.filterContainer, roboto.className)}>
				<div>
					<FaFilter />
					<span>FILTER AND SORT</span>
				</div>
				<div>
					<span>ALPHABETICALLY, A-Z</span>
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
		</div>
	)
}

export default Page
