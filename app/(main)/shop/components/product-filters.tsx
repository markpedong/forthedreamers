import React, { FC } from 'react'
import {
	Input,
	Slider,
	Button,
	CheckboxGroup,
	Checkbox,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem
} from '@heroui/react'
import { Icon } from '@iconify/react'

interface FilterProps {
	onSearch: (value: string) => void
	onPriceChange: (range: [number, number]) => void
	onCategoryChange: (categories: string[]) => void
	onSortChange: (sort: string) => void
	onRatingChange: (ratings: string[]) => void
	onReset: () => void
}

const CATEGORIES = ['Clothing', 'Shoes', 'Accessories', 'Electronics', 'Home & Living', 'Sports']

const SORT_OPTIONS = [
	{ key: 'newest', label: 'Newest First', icon: 'lucide:clock' },
	{ key: 'price-asc', label: 'Price: Low to High', icon: 'lucide:arrow-up' },
	{ key: 'price-desc', label: 'Price: High to Low', icon: 'lucide:arrow-down' },
	{ key: 'rating', label: 'Highest Rated', icon: 'lucide:star' }
]

const RATINGS = ['5', '4', '3', '2', '1']

const ProductFilters: FC<FilterProps> = ({
	onSearch,
	onPriceChange,
	onCategoryChange,
	onSortChange,
	onRatingChange,
	onReset
}) => {
	const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000])
	const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
	const [selectedRatings, setSelectedRatings] = React.useState<string[]>([])
	const [currentSort, setCurrentSort] = React.useState(SORT_OPTIONS[0])

	const handlePriceChange = (value: number | number[]) => {
		if (Array.isArray(value)) {
			setPriceRange(value as [number, number])
			onPriceChange(value as [number, number])
		}
	}

	const handleCategoryChange = (values: string[]) => {
		setSelectedCategories(values)
		onCategoryChange(values)
	}

	const handleRatingChange = (values: string[]) => {
		setSelectedRatings(values)
		onRatingChange(values)
	}

	const handleSortChange = (key: string) => {
		const option = SORT_OPTIONS.find(opt => opt.key === key)
		if (option) {
			setCurrentSort(option)
			onSortChange(key)
		}
	}

	const handleReset = () => {
		setPriceRange([0, 1000])
		setSelectedCategories([])
		setSelectedRatings([])
		setCurrentSort(SORT_OPTIONS[0])
		onReset()
	}

	return (
		<div className="flex flex-col gap-6 p-4 bg-default-100 rounded-lg">
			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Search</h3>
				<Input
					placeholder="Search products..."
					startContent={<Icon icon="lucide:search" />}
					onChange={e => onSearch(e.target.value)}
					size="sm"
				/>
			</div>

			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Sort By</h3>
				<Dropdown>
					<DropdownTrigger>
						<Button
							variant="bordered"
							startContent={<Icon icon={currentSort.icon} />}
							className="w-full justify-between"
						>
							{currentSort.label}
						</Button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Sort options" onAction={key => handleSortChange(key.toString())}>
						{SORT_OPTIONS.map(option => (
							<DropdownItem key={option.key} startContent={<Icon icon={option.icon} />}>
								{option.label}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>

			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Price Range</h3>
				<Slider
					size="sm"
					step={10}
					minValue={0}
					maxValue={1000}
					value={priceRange}
					onChange={handlePriceChange}
					className="max-w-md"
				/>
				<div className="flex justify-between text-sm text-default-500">
					<span>${priceRange[0]}</span>
					<span>${priceRange[1]}</span>
				</div>
			</div>

			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Categories</h3>
				<CheckboxGroup value={selectedCategories} onValueChange={handleCategoryChange} className="gap-2">
					{CATEGORIES.map(category => (
						<Checkbox key={category} value={category}>
							{category}
						</Checkbox>
					))}
				</CheckboxGroup>
			</div>

			<div className="space-y-2">
				<h3 className="text-lg font-semibold">Rating</h3>
				<CheckboxGroup value={selectedRatings} onValueChange={handleRatingChange} className="gap-2">
					{RATINGS.map(rating => (
						<Checkbox key={rating} value={rating} className="gap-2">
							<div className="flex items-center gap-1">
								{Array.from({ length: Number(rating) }).map((_, i) => (
									<Icon key={i} icon="lucide:star" className="text-warning" />
								))}
								<span>& Up</span>
							</div>
						</Checkbox>
					))}
				</CheckboxGroup>
			</div>

			<Button
				size="sm"
				variant="flat"
				color="primary"
				startContent={<Icon icon="lucide:refresh-ccw" />}
				onPress={handleReset}
				className="w-full"
			>
				Reset Filters
			</Button>
		</div>
	)
}

export default ProductFilters
