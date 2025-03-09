'use client'

import { useDisclosure } from '@heroui/react'
import React, { FC } from 'react'
import Header from './header'
import { Users } from '@prisma/client'
import EditProfileModal from './edit-profile'

type Props = {
	userInfo: Users
}

const SellerDashboard: FC<Props> = ({ userInfo }) => {
	const editProfileModal = useDisclosure()

	const handleUpdateProfile = (profileData: any) => {
		editProfileModal.onClose()
	}

	return (
		<div>
			<Header userInfo={userInfo} onEditProfile={editProfileModal.onOpen} />
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
