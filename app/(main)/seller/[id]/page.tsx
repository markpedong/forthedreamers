import React from 'react'
import Seller from './components'
import { getSellerInfo } from '@/utils/request'
import { getAllSellers } from '@/lib/server'

export async function generateStaticParams() {
	const sellers = await getAllSellers()

	return sellers.map(seller => ({
		id: seller.id
	}))
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params
	const seller = await getSellerInfo(id)

	return <Seller seller={seller.data} />
}

export default Page
