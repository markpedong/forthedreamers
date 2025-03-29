'use client'

import { clearUserData } from '@/lib'
import { setCartItems, setUserData } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { uploadProfile } from '@/utils/request'
import { getLocalStorage, setLocalStorage } from '@/utils/xLocalStorage'
import { Button, Spinner, Switch } from '@heroui/react'
import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { FC, useEffect, useState, useTransition } from 'react'
import styles from '../styles.module.scss'
import {
	ADDRESS_TYPE,
	PaymentMethods as TPaymentMethods,
	Addresses as TAddresses,
	Users,
	Orders as TOrders,
	Reviews as TReviews,
	Wishlists as TWishlists
} from '@prisma/client'
import { setHasDefaultAddress, toggleDarkMode } from '@/redux/slices/appSlice'
import { Icon } from '@iconify/react'
import WishList from './wishlist'
import { CartResponse, TWishListItem } from '@/constants/types'
import UploadImage from '@/components/profile/uploadImage'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

type Props = {
	userInfo: Users
	addresses: TAddresses[]
	paymentMethods: TPaymentMethods[]
	orders: TOrders[]
	reviews: TReviews[]
	wishlist: TWishListItem[]
	carts: CartResponse[]
}

const PersonalInformation = dynamic(() => import('./personal-information'), { ssr: false })
const Addresses = dynamic(() => import('./addresses'), { ssr: false })
const PaymentMethods = dynamic(() => import('./payment-methods'), { ssr: false })
const Orders = dynamic(() => import('./orders'), { ssr: false })
const Reviews = dynamic(() => import('./reviews'), { ssr: false })

const Profile: FC<Props> = ({ addresses, userInfo, paymentMethods, orders, reviews, wishlist, carts }) => {
	const menus = ['Personal Information', 'Addresses', 'Payment Methods', 'Orders', 'Wishlist', 'Reviews']
	const [activeMenu, setActiveMenu] = useState<string>('Personal Information')
	const dispatch = useAppDispatch()
	const { data: session } = useSession()
	const userData = useAppSelector(state => state.user.userData)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const darkMode = useAppSelector(state => state.app.darkMode)
	const { setTheme } = useTheme()

	useEffect(() => {
		fetchUserData()
	}, [session, userInfo])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		startTransition(async () => {
			const response = await uploadProfile(file)
			if (response?.success) {
				dispatch(setUserData({ ...userData, image: response.data.secure_url }))
				router.refresh()
			}
		})
	}

	const fetchUserData = async () => {
		if (!session?.user?.id || !session?.accessToken) return
		if (!getLocalStorage('accessToken')) setLocalStorage('accessToken', session.accessToken)
		if (addresses?.findIndex(address => address.type === ADDRESS_TYPE.DEFAULT) !== -1) {
			dispatch(setHasDefaultAddress(true))
		}

		dispatch(setCartItems(carts))
		dispatch(setUserData(userInfo))
	}

	const toggle = () => {
		dispatch(toggleDarkMode())
		setTheme(darkMode ? 'light' : 'dark')
	}

	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileContainer}>
				<div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)] flex flex-col justify-between">
					<div className="p-5 mb-10">
						<div className="flex justify-between items-center mb-16 mt-4">
							<div
								className="flex gap-2 items-center justify-start text-sm text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer"
								onClick={() => router.push('/')}
							>
								<Icon icon="pajamas:go-back" />
								<span>Back</span>
							</div>
							<Button
								size="sm"
								color="default"
								onPress={() => {
									clearUserData()
									signOut()
								}}
							>
								Signout
							</Button>
						</div>
						<div className="flex flex-col gap-1 text-sm pl-3">
							<UploadImage isPending={isPending} handleFileChange={handleFileChange} />
							<span className="capitalize pt-2">
								{userData?.firstName} {userData?.lastName}
							</span>
							<span className="text-neutral-400">Customer</span>
						</div>
						<div className="flex flex-col gap-1 text-sm mt-7">
							{menus.map((menu, index) => (
								<span
									key={index}
									onClick={() => setActiveMenu(menu)}
									className={classNames('cursor-pointer px-3 py-2 transition-all', {
										'border-l-2 border-gray-500 text-black bg-gray-100': activeMenu === menu,
										'text-neutral-400': activeMenu !== menu
									})}
								>
									{menu}
								</span>
							))}
						</div>
					</div>
					<div className="px-5">
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
					</div>
				</div>
				<div className="p-5 h-full">
					{activeMenu === 'Personal Information' && <>{userData && <PersonalInformation />}</>}
					{activeMenu === 'Addresses' && <Addresses data={addresses} />}
					{activeMenu === 'Payment Methods' && <PaymentMethods data={paymentMethods} />}
					{activeMenu === 'Orders' && <Orders data={orders} />}
					{activeMenu === 'Wishlist' && <WishList data={wishlist} />}
					{activeMenu === 'Reviews' && <Reviews data={reviews} />}
				</div>
			</div>
		</div>
	)
}

export default Profile
