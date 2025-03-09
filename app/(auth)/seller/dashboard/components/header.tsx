import React, { FC } from 'react'
import { Card, CardBody, Avatar, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Users } from '@prisma/client'

type Props = {
	userInfo: Users
	onEditProfile: () => void
}

const Header: FC<Props> = ({ userInfo, onEditProfile }) => {
	const { storeName, firstName, lastName, email, phoneNumber, image } = userInfo

	return (
		<Card>
			<CardBody className="flex flex-col md:flex-row gap-4 items-center md:items-start">
				<Avatar src={image || `https://i.pravatar.cc/150?u=${email}`} className="w-24 h-24" />
				<div className="flex-1 text-center md:text-left">
					<h2 className="text-2xl font-bold">{storeName}</h2>
					<p className="text-default-500">
						{firstName} {lastName}
					</p>
					<div className="flex flex-col md:flex-row gap-2 mt-2">
						<div className="flex items-center gap-1">
							<Icon icon="lucide:mail" className="text-default-400" />
							<span className="text-small">{email}</span>
						</div>
						{phoneNumber && (
							<div className="flex items-center gap-1">
								<Icon icon="lucide:phone" className="text-default-400" />
								<span className="text-small">{phoneNumber}</span>
							</div>
						)}
					</div>
				</div>
				<Button variant="flat" color="primary" startContent={<Icon icon="lucide:edit" />} onPress={onEditProfile}>
					Edit Profile
				</Button>
			</CardBody>
		</Card>
	)
}

export default Header
