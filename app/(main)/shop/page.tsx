import React from 'react'
import Shop from './components'
import { getProducts } from '@/utils/request'

const Page = async () => {
	const products = await getProducts()

	return <Shop products={products.data} />
}

export default Page
