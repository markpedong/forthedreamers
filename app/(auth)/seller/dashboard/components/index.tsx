'use client'

import { useDisclosure } from '@heroui/react'
import React, { FC } from 'react'
import Header from './header'
import { Users } from '@prisma/client'
import EditProfileModal from './edit-profile'
import StatsCard from './stats-card'
import styles from '../styles.module.scss'

type Props = {
	userInfo: Users
}

const SellerDashboard: FC<Props> = ({ userInfo }) => {
	const editProfileModal = useDisclosure()

	const handleUpdateProfile = (profileData: any) => {
		editProfileModal.onClose()
	}

	return (
		<div className={styles.sellerContainer}>
			<Header userInfo={userInfo} onEditProfile={editProfileModal.onOpen} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title="Total Products" value="24" icon="lucide:package" trend={{ value: 12, isPositive: true }} />
				<StatsCard
					title="Total Orders"
					value="156"
					icon="lucide:shopping-cart"
					trend={{ value: 8, isPositive: true }}
				/>
				<StatsCard
					title="Total Revenue"
					value="$12,426"
					icon="lucide:dollar-sign"
					trend={{ value: 15, isPositive: true }}
				/>
				<StatsCard title="Average Rating" value="4.8" icon="lucide:star" trend={{ value: 2, isPositive: true }} />
			</div>
			<EditProfileModal
				isOpen={editProfileModal.isOpen}
				onClose={editProfileModal.onClose}
				onSubmit={handleUpdateProfile}
				userInfo={userInfo}
			/>
		</div>
	)
}

export default SellerDashboard
