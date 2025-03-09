import React from 'react'
import styles from './styles.module.scss'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProfileServer } from '@/lib/server'
import SellerDashboard from './components'
import { Users } from '@prisma/client'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo] = await Promise.all([getProfileServer(session?.user?.id, true)])

	return (
		<div className={styles.sellerWrapper}>
			<div className={styles.sellerContainer}>
				<SellerDashboard userInfo={userInfo as Users} />
			</div>
		</div>
	)
}

export default Page
