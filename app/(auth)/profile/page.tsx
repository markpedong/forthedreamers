import authOptions from '@/app/api/auth/[...nextauth]/options'
import { TWishListItem } from '@/constants/types'
import { getOrderServer, getPaymentMethodServer, getReviewServer, getWishlistServer } from '@/lib/server'
import { getAddress, getUserData } from '@/utils/request'
import { Users } from '@prisma/client'
import { getServerSession } from 'next-auth'
import Profile from './components'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo, addresses, paymentMethods, orders, reviews, wishlist] = await Promise.all([
		getUserData(`${session?.user.id}`),
		getAddress(`${session?.user?.id}`),
		getPaymentMethodServer(session?.user?.id),
		getOrderServer(session?.user?.id),
		getReviewServer(session?.user?.id),
		getWishlistServer(session?.user?.id)
	])

	return (
		<Profile
			userInfo={userInfo.data}
			addresses={addresses.data}
			paymentMethods={paymentMethods}
			orders={orders}
			reviews={reviews}
			wishlist={wishlist as TWishListItem[]}
		/>
	)
}

export default Page
