'use client'

import Loading from '@/components/loading'
import UploadImage from '@/components/profile/uploadImage'
import { TOrdersResponse, TReviewItem, TWishListItem } from '@/constants/types'
import { clearUserData } from '@/lib'
import { toggleDarkMode } from '@/redux/slices/appSlice'
import { setUserData } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { uploadProfile } from '@/utils/request'
import { getLocalStorage, setLocalStorage } from '@/utils/xLocalStorage'
import { Button, Switch } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Addresses as TAddresses, PaymentMethods as TPaymentMethods, Users } from '@prisma/client'
import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useTransition } from 'react'
import styles from '../styles.module.scss'
import WishList from './wishlist'
import { PROFILE_MENUS } from '@/constants'

type Props = {
	userInfo: Users | null
	addresses: TAddresses[]
	paymentMethods: TPaymentMethods[]
	orders: TOrdersResponse[]
	wishlist: TWishListItem[]
	reviews: TReviewItem[]
}

const PersonalInformation = dynamic(() => import('./personal-information'))
const Addresses = dynamic(() => import('./addresses'))
const PaymentMethods = dynamic(() => import('./payment-methods'))
const Orders = dynamic(() => import('./orders'))
const Reviews = dynamic(() => import('./reviews'))

const Profile: FC<Props> = ({ userInfo, addresses, paymentMethods, orders, wishlist, reviews }) => {
	const { darkMode } = useAppSelector(state => state.app)
	const dispatch = useAppDispatch()
	const { data: session } = useSession()
	const { userData } = useAppSelector(state => state.user)
	const [isPending, startTransition] = useTransition()
	const [isNavigating, startNavigate] = useTransition()
	const router = useRouter()
	const { setTheme } = useTheme()
	const params = useSearchParams()
	const tab = params.get('tab')

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

	const fetchUserData = () => {
		if (!session?.user?.id || !session?.accessToken) return
		if (!getLocalStorage('accessToken')) setLocalStorage('accessToken', session.accessToken)
		if (!tab) router.push('/profile?tab=personal-information')

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
								color="primary"
								variant="solid"
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
							{PROFILE_MENUS.map((menu, index) => (
								<span
									key={index}
									onClick={() =>
										tab !== menu && !isNavigating && startNavigate(() => router.push(`/profile?tab=${menu}`))
									}
									className={classNames('cursor-pointer px-3 py-2 transition-all', {
										'border-l-2 border-gray-500 text-black bg-gray-100': tab === menu,
										'text-neutral-400': tab !== menu
									})}
								>
									{menu?.replaceAll('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
				{isNavigating ? (
					<Loading />
				) : (
					<div className="p-5 h-full">
						{tab === 'personal-information' && <>{userData && <PersonalInformation />}</>}
						{tab === 'addresses' && <Addresses data={addresses} />}
						{tab === 'payment-methods' && <PaymentMethods data={paymentMethods} />}
						{tab === 'orders' && <Orders data={orders} />}
						{tab === 'wishlist' && <WishList data={wishlist} />}
						{tab === 'reviews' && <Reviews data={reviews} />}
					</div>
				)}
			</div>
		</div>
	)
}

export default Profile
