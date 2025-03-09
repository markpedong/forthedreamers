import React from 'react'
import ProductPage from '.'
import { getProductDetails, getProductserver } from '@/lib/server'
import prisma from '@/db'
import { TProductItem } from '@/constants/types'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
	const product = await getProductserver()

	return product.map(post => ({
		id: post.id
	}))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const product = await getProductDetails(id)

	if (!product) {
		notFound()
	}

	return <ProductPage product={product as any} />
}

export default Page
