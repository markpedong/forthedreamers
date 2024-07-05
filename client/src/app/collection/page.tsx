import React from 'react'
import styles from './styles.module.scss'
import Category from './components/category'
import classNames from 'classnames'
import { FaArrowRight } from 'react-icons/fa'
import { Roboto_Condensed } from 'next/font/google'
import PageTitle from '@/components/page-title'

const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

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
