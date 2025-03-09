import { TVariationItem } from '@/constants/types'
import {
	Button,
	Card,
	CardBody,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea
} from '@heroui/react'
import { Icon } from '@iconify/react'
import React from 'react'

interface AddProductModalProps {
	isOpen: boolean
	onClose: () => void
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
	const [name, setName] = React.useState('')
	const [description, setDescription] = React.useState('')
	const [variations, setVariations] = React.useState<TVariationItem[]>([])
	const [images, setImages] = React.useState<File[]>([])
	const [imagePreviewUrls, setImagePreviewUrls] = React.useState<string[]>([])
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// onSubmit({
		// 	name,
		// 	description,
		// 	variations: variations.filter(v => v.label && v.price > 0),
		// 	images
		// })
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length + images.length > 10) {
			alert('Maximum 10 images allowed')
			return
		}

		const newImages = [...images, ...files]
		setImages(newImages)

		const newPreviewUrls = files.map(file => URL.createObjectURL(file))
		setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
	}

	const removeImage = (index: number) => {
		const newImages = [...images]
		const newPreviewUrls = [...imagePreviewUrls]

		// Revoke the URL to prevent memory leaks
		URL.revokeObjectURL(newPreviewUrls[index])

		newImages.splice(index, 1)
		newPreviewUrls.splice(index, 1)

		setImages(newImages)
		setImagePreviewUrls(newPreviewUrls)
	}

	const addVariation = () => {
		setVariations([...variations, { label: '', stock: 0, price: 0, discountedPrice: 0, productId: '' }])
	}

	const removeVariation = (index: number) => {
		const newVariations = [...variations]
		newVariations.splice(index, 1)
		setVariations(newVariations)
	}

	const updateVariation = (index: number, field: keyof TVariationItem, value: string | number) => {
		const newVariations = [...variations]
		newVariations[index] = {
			...newVariations[index],
			[field]: field === 'label' ? value : Number(value)
		}
		setVariations(newVariations)
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">Add New Product</ModalHeader>
						<ModalBody>
							<form onSubmit={handleSubmit}>
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
												<Button
													variant="flat"
													className="h-[100px] w-full"
													onPress={() => fileInputRef.current?.click()}
												>
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
										<p className="text-tiny text-default-400">Supported formats: PNG, JPG, GIF (Max 10 images)</p>
									</div>
									<div>
										<div className="flex justify-between items-center mb-2">
											<p className="text-small font-medium">Product Variations</p>
											<Button
												size="sm"
												variant="flat"
												color="primary"
												onPress={addVariation}
												startContent={<Icon icon="lucide:plus" className="w-4 h-4" />}
											>
												Add Variation
											</Button>
										</div>
										<div className="space-y-4">
											{variations.map((variation, index) => (
												<Card key={index}>
													<CardBody className="gap-4">
														<div className="flex justify-between items-start gap-2">
															<Input
																label="Variation Name"
																placeholder="e.g., 16GB RAM, 512GB SSD"
																value={variation.label}
																onValueChange={value => updateVariation(index, 'label', value)}
																className="flex-1"
															/>
															<Button
																isIconOnly
																color="danger"
																variant="light"
																onPress={() => removeVariation(index)}
																className="mt-7"
															>
																<Icon icon="lucide:trash" className="w-4 h-4" />
															</Button>
														</div>
														<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
															<Input
																type="number"
																label="Price"
																placeholder="0.00"
																value={variation.price.toString()}
																onValueChange={value => updateVariation(index, 'price', value)}
																startContent={
																	<div className="pointer-events-none flex items-center">
																		<span className="text-default-400 text-small">$</span>
																	</div>
																}
															/>
															<Input
																type="number"
																label="Discounted Price (Optional)"
																placeholder="0.00"
																value={variation.discountedPrice?.toString() || ''}
																onValueChange={value => updateVariation(index, 'discountedPrice', value)}
																startContent={
																	<div className="pointer-events-none flex items-center">
																		<span className="text-default-400 text-small">$</span>
																	</div>
																}
															/>
															<Input
																type="number"
																label="Stock"
																placeholder="0"
																value={variation.stock.toString()}
																onValueChange={value => updateVariation(index, 'stock', value)}
															/>
														</div>
													</CardBody>
												</Card>
											))}
										</div>
									</div>
								</div>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={onClose}>
								Cancel
							</Button>
							<Button color="primary" type="submit">
								Add Product
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default AddProductModal
