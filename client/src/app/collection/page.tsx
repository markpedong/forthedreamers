import React from 'react'
import styles from './styles.module.scss'
import Category from './components/category'
import { PageTitle } from '@/components/page-components'
import Pagination from '@/components/pagination'

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<PageTitle title="SHOP BY CATEGORY" />
			<div className={styles.categoryWrapper}>
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
				<Category />
			</div>
			<Pagination />
		</div>
	)
}

export default Page
