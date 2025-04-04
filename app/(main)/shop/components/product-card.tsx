import React, { FC } from 'react'
import { Card, CardBody, CardFooter } from '@heroui/react'
import { Icon } from '@iconify/react'
import { TProductItem } from '@/constants/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { calculateAverageRating } from '@/utils/helpers'

interface ProductCardProps {
	product: TProductItem
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
	const router = useRouter()
	const lowestPrice = React.useMemo(() => {
		return Math.min(...product.variations.map(v => v.price))
	}, [product.variations])

	const discountPercentage = React.useMemo(() => {
		const variation = product.variations.find(v => v.discountedPrice)
		if (!variation) return 0
		return Math.round(((variation.price - variation.discountedPrice) / variation.price) * 100)
	}, [product.variations])

	const totalStock = React.useMemo(() => {
		return product.variations.reduce((acc, v) => acc + v.stock, 0)
	}, [product.variations])

	return (
		<Card isPressable isHoverable className="w-full" onPress={() => router.push(`/products/${product.id}`)}>
			<CardBody className="p-0">
				<div className="relative">
					<Image
						src={product.images[0] || 'https://picsum.photos/200'}
						alt={product.name}
						className="w-full h-48 object-cover"
						width={200}
						height={200}
					/>
					<div className="absolute top-0 left-0 p-2 flex flex-col gap-2 z-10">
						{discountPercentage > 0 && (
							<div className="bg-danger-500 px-2 py-1 rounded-lg text-xs font-medium text-white">
								-{discountPercentage}% OFF
							</div>
						)}
					</div>
					<div className="absolute top-0 right-0 p-2">
						{totalStock < 10 && totalStock > 0 && (
							<div className="bg-warning-500 px-2 py-1 rounded-lg text-xs font-medium">Low Stock</div>
						)}
					</div>
					{totalStock === 0 && (
						<div className="absolute inset-0 bg-default/60 flex items-center justify-center">
							<div className="bg-danger-500 px-3 py-1.5 rounded-lg text-sm font-medium">Out of Stock</div>
						</div>
					)}
				</div>
			</CardBody>

			<CardFooter className="flex flex-col items-start gap-2">
				<h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
				<p className="text-default-500 text-sm line-clamp-1 text-start">{product.description}</p>
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col">
						<span className="font-bold">${lowestPrice.toFixed(2)}</span>
						{discountPercentage > 0 && (
							<span className="text-default-500 text-sm line-through">
								${(lowestPrice * (1 + discountPercentage / 100)).toFixed(2)}
							</span>
						)}
					</div>
					<div className="flex items-center gap-1">
						<Icon icon="lucide:star" className="text-warning" />
						<span className="font-medium">{calculateAverageRating(product.reviews)}</span>
						<span className="text-default-500 text-sm">({product.reviews.length})</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}

export default ProductCard
