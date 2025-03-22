import React from 'react'
import Shop from './components'
import { getProducts } from '@/lib/server'
import { TProductItem } from '@/constants/types'

const Page = async () => {
	const products = await getProducts()

	return <Shop products={products as TProductItem[]} />
}

export default Page
