import React from 'react'
import ProductPage from '.'
import { getAllProducts } from '@/lib/server'
import { notFound } from 'next/navigation'
import { getProduct } from '@/utils/request'

export async function generateStaticParams() {
	const product = await getAllProducts()

	return product.map(post => ({
		id: post.id
	}))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const product = await getProduct(id)

	if (!product) {
		notFound()
	}

	return <ProductPage product={product.data} />
}

export default Page
