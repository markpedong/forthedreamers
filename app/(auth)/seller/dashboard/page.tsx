import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProductReviews, getSoldProducts } from '@/lib/server'
import { getSellerInfo } from '@/utils/request'
import { getServerSession } from 'next-auth'
import SellerDashboard from './components'
import styles from './styles.module.scss'
import { USER_ROLE } from '@prisma/client'
import { unauthorized } from 'next/navigation'
import { TOrdersResponse } from '@/constants/types'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo, orders, reviews] = await Promise.all([
		getSellerInfo(`${session?.user?.id}`),
		getSoldProducts(session?.user?.id),
		getProductReviews(session?.user?.id)
	])

	if (session?.user.role === USER_ROLE.USER) {
		unauthorized()
	}

	return (
		<div className={styles.sellerWrapper}>
			<SellerDashboard
				userInfo={userInfo.data}
				orders={orders as unknown as TOrdersResponse[]}
				products={userInfo.data.products}
				reviews={reviews}
			/>
		</div>
	)
}

export default Page
