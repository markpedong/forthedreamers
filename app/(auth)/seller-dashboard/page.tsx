import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProductReviews, getSellerInfo, getSellerProducts, getSoldProducts } from '@/lib/server'
import { USER_ROLE } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { unauthorized } from 'next/navigation'
import SellerDashboard from './components'
import { SellerInfo, TOrdersResponse, TProductItem, TReviewItem } from '@/constants/types'

const Page = async ({ searchParams }: { searchParams: Promise<{ tab: string }> }) => {
	const session = await getServerSession(authOptions)
	const tab = (await searchParams).tab
	const userInfo: SellerInfo = (await getSellerInfo(`${session?.user?.id}`)).data

	let products: TProductItem[] = [],
		orders: TOrdersResponse[] = [],
		reviews: TReviewItem[] = []

	switch (tab) {
		case 'products':
			products = (await getSellerProducts(`${session?.user?.id}`)).data
			break
		case 'orders':
			orders = (await getSoldProducts(`${session?.user?.id}`)).data
			break
		case 'reviews':
			reviews = (await getProductReviews(`${session?.user?.id}`)).data
			break
	}

	if (session?.user.role === USER_ROLE.USER) {
		unauthorized()
	}

	return (
		<div className="max-w-7xl mx-auto h-screen">
			<SellerDashboard userInfo={userInfo} orders={orders} products={products} reviews={reviews} />
		</div>
	)
}

export default Page
