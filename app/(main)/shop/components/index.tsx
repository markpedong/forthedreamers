'use client'

import React, { FC, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { TProductItem } from '@/constants/types'
import { Pagination, Button, Chip } from '@heroui/react'
import ProductCard from './product-card'
import ProductFilters from './product-filters'

type Props = {
	products: TProductItem[]
}

const Shop: FC<Props> = ({ products }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])
	const [selectedRatings, setSelectedRatings] = useState<string[]>([])
	const [sortBy, setSortBy] = useState('newest')
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 12

	const filteredProducts = useMemo(() => {
		return products
			.filter(product => {
				const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
				const lowestPrice = Math.min(...product.variations.map(v => v.price))
				const matchesPrice = lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1]
				const matchesCategory =
					selectedCategories.length === 0 || product.categories?.some(category => selectedCategories.includes(category))
				const matchesRating = selectedRatings.length === 0 || selectedRatings.includes('4')

				return matchesSearch && matchesPrice && matchesCategory && matchesRating
			})
			.sort((a, b) => {
				switch (sortBy) {
					case 'price-asc':
						return Math.min(...a.variations.map(v => v.price)) - Math.min(...b.variations.map(v => v.price))
					case 'price-desc':
						return Math.min(...b.variations.map(v => v.price)) - Math.min(...a.variations.map(v => v.price))
					case 'rating':
						return 0 // Replace with actual rating logic
					default:
						return b.createdAt?.getTime() - a.createdAt?.getTime()
				}
			})
	}, [searchQuery, priceRange, selectedCategories, selectedRatings, sortBy])

	const paginatedProducts = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage
		const end = start + itemsPerPage
		return filteredProducts.slice(start, end)
	}, [filteredProducts, currentPage])

	const handleReset = () => {
		setSearchQuery('')
		setPriceRange([0, 1000])
		setSelectedCategories([])
		setSelectedRatings([])
		setSortBy('newest')
		setCurrentPage(1)
	}

	const activeFiltersCount = [
		searchQuery,
		...selectedCategories,
		...selectedRatings,
		priceRange[0] > 0 || priceRange[1] < 1000 ? 'price' : ''
	].filter(Boolean).length

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				{activeFiltersCount > 0 && (
					<Chip color="primary" variant="flat" endContent={<Icon icon="lucide:filter" />}>
						{activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} applied
					</Chip>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<ProductFilters
						onSearch={setSearchQuery}
						onPriceChange={setPriceRange}
						onCategoryChange={setSelectedCategories}
						onSortChange={setSortBy}
						onRatingChange={setSelectedRatings}
						onReset={handleReset}
					/>
				</div>

				<div className="lg:col-span-3">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{paginatedProducts.map(product => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{filteredProducts.length === 0 ? (
						<div className="text-center py-8 text-default-500">
							<Icon icon="lucide:search-x" className="w-12 h-12 mx-auto mb-4" />
							<p className="text-lg font-semibold">No products found</p>
							<p className="mt-2">Try adjusting your search or filter criteria</p>
							<Button
								color="primary"
								variant="flat"
								className="mt-4"
								onPress={handleReset}
								startContent={<Icon icon="lucide:refresh-ccw" />}
							>
								Reset Filters
							</Button>
						</div>
					) : (
						<div className="flex justify-center mt-8">
							<Pagination
								total={Math.ceil(filteredProducts.length / itemsPerPage)}
								page={currentPage}
								onChange={setCurrentPage}
								showControls
								showShadow
								color="primary"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Shop
