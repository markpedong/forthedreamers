import authOptions from '@/app/api/auth/[...nextauth]/options'
import { TOrdersResponse, TReviewItem, TWishListItem } from '@/constants/types'
import { getAddress, getOrders, getPaymentMethod, getReviews, getWishlist } from '@/lib/server'
import { getUserData } from '@/utils/request'
import { Addresses, PaymentMethods, USER_ROLE, Users } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { unauthorized } from 'next/navigation'
import Profile from './components'

const Page = async ({ searchParams }: { searchParams: Promise<{ tab: string }> }) => {
	const session = await getServerSession(authOptions)

	if (session?.user.role === USER_ROLE.SELLER) {
		unauthorized()
	}

	const tab = (await searchParams).tab
	let userInfo: Users | null = null, // <Partial<Users>> # doesn't need to be used since the properties are fixed
		addresses: Addresses[] = [],
		paymentMethods: PaymentMethods[] = [],
		orders: TOrdersResponse[] = [],
		wishlist: TWishListItem[] = [],
		reviews: TReviewItem[] = []

	switch (tab) {
		case 'personal-information':
			userInfo = (await getUserData(`${session?.user.id}`)).data
			break
		case 'addresses':
			addresses = (await getAddress(`${session?.user.id}`)).data
			break
		case 'payment-methods':
			paymentMethods = (await getPaymentMethod(`${session?.user.id}`)).data
			break
		case 'orders':
			orders = (await getOrders(`${session?.user.id}`)).data
			break
		case 'wishlist':
			wishlist = (await getWishlist(`${session?.user.id}`)).data
			break
		case 'reviews':
			reviews = (await getReviews(`${session?.user.id}`)).data
			break
	}

	return (
		<Profile
			userInfo={userInfo}
			addresses={addresses}
			paymentMethods={paymentMethods}
			orders={orders}
			wishlist={wishlist}
			reviews={reviews}
		/>
	)
}

export default Page
