'use client'

import React, { FC, useMemo, useState } from 'react'
import { Card, CardBody, Avatar, Tabs, Tab, Input, Select, SelectItem, Pagination } from '@heroui/react'
import { Icon } from '@iconify/react'
import { SellerInfo, TVariationItem } from '@/constants/types'
import { DateFormatter } from '@internationalized/date'
import ProductCard from '@/app/(main)/shop/components/product-card'

type Props = {
	seller: SellerInfo
}

const Seller: FC<Props> = ({ seller }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('newest')
	const [currentPage, setCurrentPage] = useState(1)
	const findPrice = (variation: TVariationItem[]) => variation.find(v => v.discountedPrice !== null)?.price
	const products = seller.products
	const filteredProducts = useMemo(() => {
		return products
			.filter(product => searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
			.sort((a, b) => {
				switch (sortBy) {
					case 'price-asc':
						return findPrice(a.variations)! - findPrice(b.variations)!
					case 'price-desc':
						return findPrice(b.variations)! - findPrice(a.variations)!
					case 'name-asc':
						return a.name.localeCompare(b.name)
					case 'name-desc':
						return b.name.localeCompare(a.name)
					default:
						return 0
				}
			})
	}, [products, searchQuery, sortBy])

	const productsPerPage = 12
	const indexOfLastProduct = currentPage * productsPerPage
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

	const sellerSince = () => (
		<>
			{new DateFormatter('en-US', {
				month: 'long',
				year: 'numeric'
			}).format(new Date(seller.createdAt))}
		</>
	)
	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mb-8">
				<CardBody>
					<div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
						<Avatar src={`${seller.image}`} className="w-24 h-24" />
						<div className="flex-1">
							<h1 className="text-2xl font-bold mb-2">{seller.storeName}</h1>
							<div className="flex flex-wrap gap-4 text-default-500">
								<div className="flex items-center gap-1">
									<Icon icon="lucide:star" className="text-warning" />
									<span>{5} Rating</span>
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="lucide:package" />
									<span>{seller.products.length} Products</span>
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="lucide:calendar" />
									<span>Since {sellerSince()}</span>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
			<Tabs aria-label="Store sections">
				<Tab key="products" title="Products">
					<div className="py-4">
						{/* Search and Sort */}
						<div className="flex flex-col sm:flex-row gap-4 mb-6">
							<Input
								placeholder="Search products..."
								value={searchQuery}
								onValueChange={setSearchQuery}
								startContent={<Icon icon="lucide:search" />}
								className="sm:max-w-xs"
							/>
							<div className="flex-1"></div>
							<Select
								label="Sort by"
								selectedKeys={[sortBy]}
								onChange={e => setSortBy(e.target.value)}
								className="sm:max-w-xs"
							>
								<SelectItem key="newest" textValue="Newest">
									Newest
								</SelectItem>
								<SelectItem key="price-asc" textValue="Price: Low to High">
									Price: Low to High
								</SelectItem>
								<SelectItem key="price-desc" textValue="Price: High to Low">
									Price: High to Low
								</SelectItem>
								<SelectItem key="name-asc" textValue="Name: A to Z">
									Name: A to Z
								</SelectItem>
								<SelectItem key="name-desc" textValue="Name: Z to A">
									Name: Z to A
								</SelectItem>
							</Select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{currentProducts.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>

						{totalPages > 1 && (
							<div className="flex justify-center mt-8">
								<Pagination total={totalPages} initialPage={1} page={currentPage} onChange={setCurrentPage} />
							</div>
						)}
					</div>
				</Tab>
				<Tab key="about" title="About">
					<Card>
						<CardBody>
							<div className="flex flex-col gap-4">
								<div>
									<h3 className="text-lg font-semibold mb-2">About the Store</h3>
									<p className="text-default-500">
										Welcome to {seller.storeName}! We specialize in providing high-quality fashion items at competitive
										prices. Our store has been serving customers since {sellerSince()}, maintaining a high standard of
										customer service and product quality.
									</p>
								</div>

								<div>
									<h3 className="text-lg font-semibold mb-2">Store Policies</h3>
									<div className="flex flex-col gap-2">
										<div className="flex items-start gap-2">
											<Icon icon="lucide:truck" className="mt-1" />
											<div>
												<p className="font-medium">Shipping Policy</p>
												<p className="text-sm text-default-500">
													We offer worldwide shipping. Standard delivery takes 3-5 business days.
												</p>
											</div>
										</div>
										<div className="flex items-start gap-2">
											<Icon icon="lucide:refresh-ccw" className="mt-1" />
											<div>
												<p className="font-medium">Return Policy</p>
												<p className="text-sm text-default-500">
													Easy returns within 30 days of delivery. Items must be unused and in original packaging.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Tab>
			</Tabs>
		</div>
	)
}

export default Seller
