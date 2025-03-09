import React from 'react'
import styles from './styles.module.scss'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getProfileServer } from '@/lib/server'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const [userInfo] = await Promise.all([getProfileServer(session?.user?.id, true)])

	return (
		<div className={styles.sellerWrapper}>
			<div className={styles.sellerContainer}>
			</div>
		</div>
	)
}

export default Page
