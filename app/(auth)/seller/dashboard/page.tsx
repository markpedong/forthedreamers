import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProductReviews, getSoldProducts } from '@/lib/server'
import { getSellerInfo, getSellerProducts } from '@/utils/request'
import { getServerSession } from 'next-auth'
import SellerDashboard from './components'
import styles from './styles.module.scss'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo, products, orders, reviews] = await Promise.all([
		getSellerInfo(`${session?.user?.id}`),
		getSellerProducts(`${session?.user?.id}`),
		getSoldProducts(session?.user?.id),
		getProductReviews(session?.user?.id)
	])

	return (
		<div className={styles.sellerWrapper}>
			<SellerDashboard userInfo={userInfo.data} orders={orders} products={products.data} reviews={reviews} />
		</div>
	)
}

export default Page
