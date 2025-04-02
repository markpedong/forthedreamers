import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getAddress, getOrders, getPaymentMethod, getReviews, getUserData, getWishlist } from '@/utils/request'
import { getServerSession } from 'next-auth'
import Profile from './components'
import { getCartItems } from '@/lib/server'
import { unauthorized } from 'next/navigation'
import { USER_ROLE } from '@prisma/client'

const Page = async () => {
	const session = await getServerSession(authOptions)

	if (session?.user.role === USER_ROLE.SELLER) {
		unauthorized()
	}

	const [userInfo, addresses, paymentMethods, orders, reviews, wishlist, carts] = await Promise.all([
		getUserData(`${session?.user.id}`),
		getAddress(`${session?.user?.id}`),
		getPaymentMethod(`${session?.user?.id}`),
		getOrders(`${session?.user?.id}`),
		getReviews(`${session?.user?.id}`),
		getWishlist(`${session?.user?.id}`),
		getCartItems(`${session?.user?.id}`)
	])

	return (
		<Profile
			userInfo={userInfo.data}
			addresses={addresses.data}
			paymentMethods={paymentMethods.data}
			orders={orders.data}
			reviews={reviews.data}
			wishlist={wishlist.data}
			carts={carts.data}
		/>
	)
}

export default Page
