import React from 'react'
import styles from './styles.module.scss'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProductReviews, getProductserver, getProfileServer, getSoldProducts } from '@/lib/server'
import SellerDashboard from './components'
import { Users } from '@prisma/client'
import { TProductItem } from '@/constants/types'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo, products, orders, reviews] = await Promise.all([
		getProfileServer(session?.user?.id, true),
		getProductserver(session?.user?.id),
		getSoldProducts(session?.user?.id),
		getProductReviews(session?.user?.id)
	])

	return (
		<div className={styles.sellerWrapper}>
			<SellerDashboard
				userInfo={userInfo as Users}
				orders={orders}
				products={products as TProductItem[]}
				reviews={reviews}
			/>
		</div>
	)
}

export default Page
