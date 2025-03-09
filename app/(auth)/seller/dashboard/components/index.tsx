'use client'
import { Alert, Button, Card, CardBody, CardHeader, Tab, Tabs, useDisclosure } from '@heroui/react'
import React, { FC, useState } from 'react'
import Header from './header'
import { Orders, Reviews, Users } from '@prisma/client'
import EditProfileModal from './edit-profile'
import StatsCard from './stats-card'
import styles from '../styles.module.scss'
import AddEditProduct from './addedit-product'
import { Icon } from '@iconify/react'
import { TProductItem } from '@/constants/types'
import ProductTable from './table-product'
import OrdersTable from './table-orders'
import ReviewsSection from './table-review'

type Props = {
	userInfo: Users
	products: TProductItem[]
	orders: Orders[]
	reviews: Reviews[]
}

const SellerDashboard: FC<Props> = ({ userInfo, products, orders, reviews }) => {
	const editProfileModal = useDisclosure()
	const addProductModal = useDisclosure()
	const editProductModal = useDisclosure()
	const [selectedProduct, setSelectedProduct] = useState<any>(null)
	const [selectedTab, setSelectedTab] = useState('products')

	// const handleUpdateProduct = (productData: any) => {
	// 	console.log('Updated product data:', productData)
	// 	editProductModal.onClose()
	// }

	const handleEditProduct = (product: any) => {
		setSelectedProduct(product)
		editProductModal.onOpen()
	}

	return (
		<div className={styles.sellerContainer}>
			<div className="flex gap-2 items-center ">
				<Icon icon="bx:arrow-back" height={20} />
				<div className="font-bold">Go back to home</div>
			</div>
			{!userInfo?.storeName && (
				<Alert
					color="warning"
					title="Please note that your products will only appear on the website if you added a store name"
				/>
			)}
			<Header userInfo={userInfo} onEditProfile={editProfileModal.onOpen} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title="Total Products"
					value="24"
					icon="lucide:package"
					// trend={{ value: 12, isPositive: true }}
				/>
				<StatsCard
					title="Total Orders"
					value="156"
					icon="lucide:shopping-cart"
					// trend={{ value: 8, isPositive: true }}
				/>
				<StatsCard
					title="Total Revenue"
					value="$12,426"
					icon="lucide:dollar-sign"
					// trend={{ value: 15, isPositive: true }}
				/>
				<StatsCard
					title="Average Rating"
					value="4.8"
					icon="lucide:star"
					//  trend={{ value: 2, isPositive: true }}
				/>
			</div>
			<Card>
				<CardHeader className="flex justify-between items-center">
					<Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab as any}>
						<Tab key="products" title="Products" />
						<Tab key="orders" title="Orders" />
						<Tab key="reviews" title="Reviews" />
					</Tabs>
					{selectedTab === 'products' && (
						<Button
							color="primary"
							className="customButton1"
							startContent={<Icon icon="lucide:plus" />}
							onPress={addProductModal.onOpen}
						>
							Add New Product
						</Button>
					)}
				</CardHeader>
				<CardBody>
					{selectedTab === 'products' && <ProductTable products={products} onEdit={handleEditProduct} />}
					{selectedTab === 'orders' && <OrdersTable orders={orders} />}
					{selectedTab === 'reviews' && <ReviewsSection reviews={reviews} />}
				</CardBody>
			</Card>

			{/* MODALS */}
			<AddEditProduct isOpen={addProductModal.isOpen} onClose={addProductModal.onClose} />
			{selectedProduct && (
				<AddEditProduct
					isOpen={editProductModal.isOpen}
					onClose={editProductModal.onClose}
					initialData={selectedProduct}
				/>
			)}
			<EditProfileModal isOpen={editProfileModal.isOpen} onClose={editProfileModal.onClose} userInfo={userInfo} />
		</div>
	)
}

export default SellerDashboard
