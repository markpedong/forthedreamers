import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProductReviews, getSoldProducts } from '@/lib/server'
import { getSellerInfo } from '@/utils/request'
import { USER_ROLE } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { unauthorized } from 'next/navigation'
import SellerDashboard from './components'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo, orders, reviews] = await Promise.all([
		getSellerInfo(`${session?.user?.id}`),
		getSoldProducts(`${session?.user?.id}`),
		getProductReviews(session?.user?.id)
	])

	if (session?.user.role === USER_ROLE.USER) {
		unauthorized()
	}

	return (
		<div className="max-w-7xl mx-auto h-screen">
			<SellerDashboard
				userInfo={userInfo.data}
				orders={orders.data}
				products={userInfo.data.products}
				reviews={reviews}
			/>
		</div>
	)
}

export default Page
