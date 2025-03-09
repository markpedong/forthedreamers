'use client'
import { Alert, Button, Card, CardBody, CardHeader, Switch, Tab, Tabs, useDisclosure, user } from '@heroui/react'
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
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { toggleDarkMode } from '@/redux/slices/appSlice'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { clearUserData } from '@/lib'
import { signOut } from 'next-auth/react'

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
	const darkMode = useAppSelector(state => state.app.darkMode)
	const dispatch = useAppDispatch()
	const { setTheme } = useTheme()
	const router = useRouter()

	// const handleUpdateProduct = (productData: any) => {
	// 	console.log('Updated product data:', productData)
	// 	editProductModal.onClose()
	// }

	const handleEditProduct = (product: any) => {
		setSelectedProduct(product)
		editProductModal.onOpen()
	}

	const toggle = () => {
		dispatch(toggleDarkMode())
		setTheme(darkMode ? 'light' : 'dark')
	}

	return (
		<div className={styles.sellerContainer}>
			<div className="flex justify-between">
				<div className="flex gap-2 items-center cursor-pointer" onClick={() => router.push('/')}>
					<Icon icon="bx:arrow-back" height={15} />
					<div className="font-bold text-sm">Go back to home</div>
				</div>
				<div className="flex gap-3">
					<Switch
						defaultSelected={darkMode}
						color="default"
						size="sm"
						onChange={toggle}
						thumbIcon={({ isSelected }) =>
							!isSelected ? (
								<Icon icon="solar:sun-bold" className="cursor-pointer" color="black" />
							) : (
								<Icon icon="solar:moon-bold" className="cursor-pointer" color="black" />
							)
						}
					/>
					<div
						onClick={() => {
							clearUserData()
							signOut()
						}}
					>
						Sign out
					</div>
				</div>
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
					value={products?.length}
					icon="lucide:package"
					// trend={{ value: 12, isPositive: true }}
				/>
				<StatsCard
					title="Total Orders"
					value={orders?.length}
					icon="lucide:shopping-cart"
					// trend={{ value: 8, isPositive: true }}
				/>
				<StatsCard
					title="Total Revenue"
					value={`${orders?.reduce((total, order) => total + order.total, 0)}`}
					icon="lucide:dollar-sign"
					// trend={{ value: 15, isPositive: true }}
				/>
				<StatsCard
					title="Average Rating"
					value={reviews?.reduce((total, review) => total + review.rating, 0) / reviews?.length || 0}
					icon="lucide:star"
					//  trend={{ value: 2, isPositive: true }}
				/>
			</div>
			<Card>
				<CardHeader className="flex justify-between items-center">
					<Tabs selectedKey={selectedTab} onSelectionChange={tab => setSelectedTab(tab.toString())}>
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
