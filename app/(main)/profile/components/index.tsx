'use client'

import { clearUserData } from '@/lib'
import { getUserData, uploadProfile } from '@/utils/request'
import { Button, Divider } from '@heroui/react'
import { Users } from '@prisma/client'
import classNames from 'classnames'
import { signOut, useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { IoArrowBack } from 'react-icons/io5'
import styles from '../styles.module.scss'

const PersonalInformation = dynamic(() => import('./personal-information'), { ssr: false })
const Addresses = dynamic(() => import('./addresses'), { ssr: false })
const PaymentMethods = dynamic(() => import('./payment-methods'), { ssr: false })
const Orders = dynamic(() => import('./orders'), { ssr: false })
const Reviews = dynamic(() => import('./reviews'), { ssr: false })

const Profile: FC = () => {
	const menus = ['Personal Information', 'Addresses', 'Payment Methods', 'Orders', 'Wishlist', 'Reviews']
	const [activeMenu, setActiveMenu] = useState<string>('Personal Information')
	const [userData, setUserData] = useState<Users>()
	const [image, setImage] = useState('')
	const { data: session } = useSession()
	const router = useRouter()

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const response = await uploadProfile(file)
		if (response?.success) {
			setImage(response?.data.secure_url)
		}
	}

	const fetchUserData = async () => {
		console.log("session", session)
		if (!session?.user?.id || !session?.accessToken) return
		const res = await getUserData(`${session.user.id}`, session.accessToken)
		setUserData(res?.data)
	}

	useEffect(() => {
		fetchUserData()
	}, [session])

	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileContainer}>
				<div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
					<div className="p-5 mb-10">
						<div className="flex gap-2 items-center justify-start mb-16 text-sm text-neutral-400">
							<IoArrowBack />
							<span>Back</span>
						</div>
						<div className="flex flex-col gap-1 text-sm pl-3">
							{userData?.image ? (
								<NextImage alt="sample" src={userData?.image} width="50" height="50" className="rounded-full" />
							) : (
								<label className="w-12 h-12 flex flex-col items-center justify-center bg-gray-400 text-white rounded-full cursor-pointer relative">
									<FaPlus className="text-lg absolute top-2" size={10} />
									<span className="text-xs mt-4">Upload</span>
									<input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
								</label>
							)}
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
					<Divider />
					<Button
						size="sm"
						className="m-5"
						color="default"
						onPress={() => {
							clearUserData()
							signOut()
						}}
					>
						Signout
					</Button>
				</div>
				<div className="p-5">
					{activeMenu === 'Personal Information' && <PersonalInformation />}
					{activeMenu === 'Addresses' && <Addresses />}
					{activeMenu === 'Payment Methods' && <PaymentMethods />}
					{activeMenu === 'Orders' && <Orders />}
					{activeMenu === 'Reviews' && <Reviews />}
				</div>
			</div>
		</div>
	)
}

export default Profile
