import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Avatar } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Users } from '@prisma/client'

interface EditProfileModalProps {
	isOpen: boolean
	onClose: () => void
	userInfo: Users
}

const EditProfileModal = ({ isOpen, onClose, userInfo }: EditProfileModalProps) => {
	const [formData, setFormData] = React.useState(userInfo)
	const [newImage, setNewImage] = React.useState<File>()
	const [imagePreview, setImagePreview] = React.useState(userInfo.image)
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setNewImage(file)
			setImagePreview(URL.createObjectURL(file))
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// onSubmit({
		// 	...formData,
		// 	image: newImage
		// })
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
									<Avatar src={imagePreview || `https://i.pravatar.cc/150?u=${formData.email}`} className="w-24 h-24" />
									<Button variant="flat" size="sm" onPress={() => fileInputRef.current?.click()}>
										Change Photo
									</Button>
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
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={onClose}>
								Cancel
							</Button>
							<Button color="primary" type="submit">
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
