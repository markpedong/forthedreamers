import React from 'react'
import ProductPage from '.'
import { getProductserver } from '@/lib/server'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '@/utils/request'

export async function generateStaticParams() {
	const product = await getProducts()

	return product.data.map(post => ({
		id: post.id
	}))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const product = await getProduct(id)

	if (!product) {
		notFound()
	}

	return <ProductPage product={product as any} />
}

export default Page
