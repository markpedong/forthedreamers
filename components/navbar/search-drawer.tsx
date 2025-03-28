import { Drawer, DrawerContent, DrawerHeader, DrawerBody, Input, Link, Chip, useDisclosure } from '@heroui/react'
import { FC, FormEvent, useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { SearchProductItem } from '@/constants/types'
import { getProducts } from '@/utils/request'

const SearchDrawer: FC = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [searchQuery, setSearchQuery] = useState('')
	const [recentSearches, setRecentSearches] = useState<string[]>(['t-shirt', 'jeans', 'sneakers', 'jacket'])
	const [products, setProducts] = useState<SearchProductItem>([])

	const fetchData = async () => {
		const products = await getProducts()

		setProducts(products as unknown as SearchProductItem)
	}
	useEffect(() => {
		fetchData()
	}, [])

	const filteredProducts = useMemo(() => {
		if (!searchQuery.trim()) return []

		return products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
	}, [products, searchQuery])

	const handleSearch = (e: FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
			setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)])
		}
	}

	const handleRecentSearchClick = (search: string) => {
		setSearchQuery(search)
	}

	return (
		<>
			<Icon icon="ri:search-2-fill" onClick={onOpen} className="cursor-pointer" />
			<Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="top" size="xl">
				<DrawerContent>
					{onClose => (
						<>
							<DrawerHeader className="flex flex-col gap-1">
								<form onSubmit={handleSearch} className="w-full">
									<Input
										autoFocus
										placeholder="Search for products..."
										value={searchQuery}
										onValueChange={setSearchQuery}
										startContent={<Icon icon="lucide:search" />}
										endContent={
											searchQuery ? (
												<button type="button" onClick={() => setSearchQuery('')}>
													<Icon icon="lucide:x" className="text-default-400" />
												</button>
											) : null
										}
										size="lg"
									/>
								</form>
							</DrawerHeader>
							<DrawerBody>
								{!searchQuery.trim() ? (
									<div className="flex flex-col gap-4">
										<div>
											<h3 className="text-sm font-medium mb-2">Recent Searches</h3>
											<div className="flex flex-wrap gap-2">
												{recentSearches.map((search, index) => (
													<Chip
														key={index}
														variant="flat"
														onClick={() => handleRecentSearchClick(search)}
														className="cursor-pointer"
													>
														{search}
													</Chip>
												))}
											</div>
										</div>
										<div>
											<h3 className="text-sm font-medium mb-2">Popular Categories</h3>
											<div className="flex flex-wrap gap-2">
												{['Clothing', 'Shoes', 'Accessories', 'Electronics', 'Home'].map((category, index) => (
													<Chip
														key={index}
														variant="flat"
														onClick={() => handleRecentSearchClick(category)}
														className="cursor-pointer"
													>
														{category}
													</Chip>
												))}
											</div>
										</div>
									</div>
								) : filteredProducts.length > 0 ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{filteredProducts.map(product => (
											<Link
												key={product.id}
												href={`/products/${product.id}`}
												className="flex items-center gap-3 p-2 rounded-md hover:bg-default-100"
												onClick={onClose}
											>
												<img src={product.images[0]} alt={product.name} className="h-12 w-12 object-cover rounded-md" />
												<div className="flex flex-col">
													<span className="text-sm font-medium">{product.name}</span>
													<span className="text-xs text-default-500">
														${product.variations?.find(q => !!q.discountedPrice)?.discountedPrice?.toFixed(2)}
													</span>
												</div>
											</Link>
										))}
									</div>
								) : searchQuery.trim() ? (
									<div className="flex flex-col items-center justify-center h-full gap-2">
										<Icon icon="lucide:search-x" className="text-4xl text-default-300" />
										<p className="text-default-500">No products found for "{searchQuery}"</p>
									</div>
								) : null}
							</DrawerBody>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	)
}

export default SearchDrawer
