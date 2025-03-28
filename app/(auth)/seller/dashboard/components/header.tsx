import React, { FC, useTransition } from 'react'
import {
	Card,
	CardBody,
	Avatar,
	Button,
	Popover,
	PopoverTrigger,
	PopoverContent,
	useDisclosure,
	user
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { Users } from '@prisma/client'
import UploadImage from '@/components/profile/uploadImage'
import { updateProfile, uploadProfile } from '@/utils/request'
import { setUserData } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { useRouter } from 'next/navigation'

type Props = {
	userInfo: Users
	onEditProfile: () => void
}

const Header: FC<Props> = ({ userInfo, onEditProfile }) => {
	const { storeName, firstName, lastName, email, phoneNumber } = userInfo
	const [isPending, startTransition] = useTransition()
	const dispatch = useAppDispatch()
	const router = useRouter()

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		startTransition(async () => {
			const response = await uploadProfile(file)

			if (response?.success) {
				const profile = await updateProfile({
					...userInfo,
					image: response.data.secure_url
				})

				if (profile.success) {
					router.refresh()
					dispatch(setUserData({ ...userInfo, image: response.data.secure_url }))
				}
			}
		})
	}

	return (
		<Card>
			<CardBody className="flex flex-col md:flex-row gap-4 items-center md:items-start">
				<UploadImage isPending={isPending} handleFileChange={handleFileChange} />
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
				<Button
					className="customButton1"
					variant="flat"
					color="primary"
					startContent={<Icon icon="lucide:edit" />}
					onPress={onEditProfile}
				>
					Edit Profile
				</Button>
			</CardBody>
		</Card>
	)
}

export default Header
