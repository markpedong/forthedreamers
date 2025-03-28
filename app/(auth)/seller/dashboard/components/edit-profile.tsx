import React, { ChangeEvent, useRef, useState, useTransition } from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Avatar,
	addToast
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { Users } from '@prisma/client'
import { updateProfile, uploadProfile } from '@/utils/request'
import { uploadImageToCloudinary } from '@/utils/cloudinary'
import { useAppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/slices/userSlice'
import { useRouter } from 'next/navigation'
import { SellerInfo } from '@/constants/types'

interface EditProfileModalProps {
	isOpen: boolean
	onClose: () => void
	userInfo: SellerInfo
}

const EditProfileModal = ({ isOpen, onClose, userInfo }: EditProfileModalProps) => {
	const [formData, setFormData] = useState(userInfo)
	const [newImage, setNewImage] = useState<File>()
	const [imagePreview, setImagePreview] = useState(userInfo.image)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const dispatch = useAppDispatch()
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setNewImage(file)
			setImagePreview(URL.createObjectURL(file))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		startTransition(async () => {
			const uploadedImage = await uploadProfile(newImage!)
			const res = await updateProfile({
				...formData,
				image: uploadedImage?.data.secure_url
			})

			if (res.success) {
				addToast({ title: 'Success', description: 'Profile updated successfully', color: 'success' })
				dispatch(setUserData(res.data))
				onClose()
				router.refresh()
			}
		})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
			<ModalContent>
				{onClose => (
					<form onSubmit={handleSubmit}>
						<ModalHeader>Edit Profile</ModalHeader>
						<ModalBody>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col items-center gap-2">
									<Avatar src={`${imagePreview}`} className="w-24 h-24" />
									{!userInfo?.image && (
										<Button variant="flat" size="sm" onPress={() => fileInputRef.current?.click()}>
											Change Photo
										</Button>
									)}
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageChange}
									/>
								</div>
								<Input
									label="Store Name"
									placeholder="Enter store name"
									value={formData.storeName || ''}
									onValueChange={value => setFormData({ ...formData, storeName: value })}
									isRequired
									disabled={userInfo?.storeName ? true : false}
								/>
								<div className="flex gap-2">
									<Input
										label="First Name"
										placeholder="Enter first name"
										value={formData.firstName || ''}
										onValueChange={value => setFormData({ ...formData, firstName: value })}
										isRequired
									/>
									<Input
										label="Last Name"
										placeholder="Enter last name"
										value={formData.lastName || ''}
										onValueChange={value => setFormData({ ...formData, lastName: value })}
										isRequired
									/>
								</div>
								<Input
									label="Email"
									type="email"
									placeholder="Enter email"
									value={formData.email || ''}
									onValueChange={value => setFormData({ ...formData, email: value })}
									isRequired
								/>
								<Input
									label="Phone Number"
									type="tel"
									placeholder="Enter phone number"
									value={formData.phoneNumber || ''}
									onValueChange={value => setFormData({ ...formData, phoneNumber: value })}
									isRequired
									disabled={userInfo?.phoneNumber ? true : false}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={onClose}>
								Cancel
							</Button>
							<Button color="primary" type="submit" className="customButton1" isLoading={isPending}>
								Save Changes
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	)
}

export default EditProfileModal
