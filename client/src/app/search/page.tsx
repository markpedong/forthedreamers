import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import React from 'react'
import styles from './styles.module.scss'
import Header from '@/components/header'
import { PageTitle } from '@/components/page-components'
import { CiSearch } from 'react-icons/ci'
import Product from '@/components/product'
import { MdFilterListAlt } from 'react-icons/md'
import Pagination from '@/components/pagination'

const roboto = Roboto_Condensed({ weight: ['200', '300', '400', '500', '600', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<Header arr={['HOME', 'SEARCH']} />
			<PageTitle title="SEARCH RESULTS" className="!pb-1" />
			<div className={styles.inputContainer}>
				<div>
					<input type="text" />
					<CiSearch color="black" />
				</div>
			</div>
			<div className={styles.searchText}>24 results found for “hoodie”</div>
			<div className={styles.filterContainer}>
				<div>
					<MdFilterListAlt />
					<span>FILTER AND SORT</span>
				</div>
				<span>24 results</span>
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
			</div>
			<Pagination />
		</div>
	)
}

export default Page
