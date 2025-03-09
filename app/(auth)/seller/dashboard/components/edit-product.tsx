import React from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Textarea,
	Card,
	CardBody
} from '@heroui/react'
import { Icon } from '@iconify/react'

interface ProductVariation {
	label: string
	stock: number
	price: number
	discountedPrice?: number
}

interface EditProductModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: {
		name: string
		description: string
		variations: ProductVariation[]
		images: (File | string)[]
	}) => void
	initialData: {
		name: string
		description: string
		variations: ProductVariation[]
		images: string[]
	}
}

const EditProductModal = ({ isOpen, onClose, onSubmit, initialData }: EditProductModalProps) => {
	const [name, setName] = React.useState(initialData.name)
	const [description, setDescription] = React.useState(initialData.description)
	const [variations, setVariations] = React.useState<ProductVariation[]>(initialData.variations)
	const [images, setImages] = React.useState<(File | string)[]>(initialData.images)
	const [imagePreviewUrls, setImagePreviewUrls] = React.useState<string[]>(initialData.images)
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({
			name,
			description,
			variations: variations.filter(v => v.label && v.price > 0),
			images
		})
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length + images.length > 10) {
			alert('Maximum 10 images allowed')
			return
		}

		const newImages = [...images, ...files]
		setImages(newImages)

		// Create preview URLs for new files
		const newPreviewUrls = files.map(file => URL.createObjectURL(file))
		setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
	}

	const removeImage = (index: number) => {
		const newImages = [...images]
		const newPreviewUrls = [...imagePreviewUrls]

		if (typeof images[index] === 'object') {
			URL.revokeObjectURL(newPreviewUrls[index])
		}

		newImages.splice(index, 1)
		newPreviewUrls.splice(index, 1)

		setImages(newImages)
		setImagePreviewUrls(newPreviewUrls)
	}

	// Rest of the component remains similar to AddProductModal
	// but with pre-filled data

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
			<ModalContent>
				{onClose => (
					<form onSubmit={handleSubmit}>
						<ModalHeader className="flex flex-col gap-1">Edit Product</ModalHeader>
						<ModalBody>
							<div className="flex flex-col gap-4">
								<div className="space-y-4">
									<Input
										label="Product Name"
										placeholder="Enter product name"
										value={name}
										onValueChange={setName}
										isRequired
									/>
									<Textarea
										label="Description"
										placeholder="Enter product description"
										value={description}
										onValueChange={setDescription}
										isRequired
									/>
								</div>

								{/* Image Upload Section */}
								<div>
									<p className="text-small font-medium mb-2">Product Images (Max 10)</p>
									<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
										{imagePreviewUrls.map((url, index) => (
											<Card key={index} className="relative group">
												<CardBody className="p-2">
													<img
														src={url}
														alt={`Preview ${index + 1}`}
														className="w-full aspect-square object-cover rounded-lg"
													/>
													<Button
														isIconOnly
														size="sm"
														color="danger"
														variant="flat"
														className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
														onPress={() => removeImage(index)}
													>
														<Icon icon="lucide:x" className="w-4 h-4" />
													</Button>
												</CardBody>
											</Card>
										))}
										{images.length < 10 && (
											<Button variant="flat" className="h-[100px] w-full" onPress={() => fileInputRef.current?.click()}>
												<div className="flex flex-col items-center gap-1">
													<Icon icon="lucide:upload" className="w-6 h-6" />
													<span className="text-tiny">Add Image</span>
												</div>
											</Button>
										)}
									</div>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										multiple
										className="hidden"
										onChange={handleImageChange}
									/>
								</div>

								{/* Variations Section - Similar to AddProductModal */}
								{/* ... Variations section code ... */}
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

export default EditProductModal
