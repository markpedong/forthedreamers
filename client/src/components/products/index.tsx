import React from 'react'
import Product from '../product'
import styles from './styles.module.scss'
import ScrollContainer from 'react-indiana-drag-scroll'

const Products = () => {
	return (
		<div>
			<ScrollContainer className={styles.productsWrapper} horizontal={true} hideScrollbars={true}>
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
			</ScrollContainer>
		</div>
	)
}

export default Products
