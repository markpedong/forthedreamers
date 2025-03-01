'use client'

import { clearUserData } from '@/lib'
import { Button, Divider } from '@heroui/react'
import { Users } from '@prisma/client'
import { signOut, useSession } from 'next-auth/react'
import { experimental_useEffectEvent, FC, use, useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import styles from '../styles.module.scss'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { getUserData } from '@/utils/request'
import { Upload } from 'antd'
import { beforeUpload } from '@/utils/antd'
import { FaPlus } from 'react-icons/fa'
import { CldImage } from 'next-cloudinary'

const PersonalInformation = dynamic(() => import('./personal-information'), { ssr: false })
const Addresses = dynamic(() => import('./addresses'), { ssr: false })
const PaymentMethods = dynamic(() => import('./payment-methods'), { ssr: false })
const Orders = dynamic(() => import('./orders'), { ssr: false })
const Reviews = dynamic(() => import('./reviews'), { ssr: false })

const Profile: FC = () => {
	const menus = ['Personal Information', 'Addresses', 'Payment Methods', 'Orders', 'Wishlist', 'Reviews']
	const [activeMenu, setActiveMenu] = useState<string>('Personal Information')
	const [userData, setUserData] = useState<Users>()
	const { data: session } = useSession()

	const fetchUserData = async () => {
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
								<Image
									alt="sample"
									src={userData?.image} // Use this sample image or upload your own via the Media Explorer
									width="50" // Transform the image: auto-crop to square aspect_ratio
									height="50"
								/>
							) : (
								<label className="w-12 h-12 flex flex-col items-center justify-center bg-gray-400 text-white rounded-full cursor-pointer relative">
									<FaPlus className="text-lg absolute top-2" size={10} />
									<span className="text-xs mt-4">Upload</span>
									<input type="file" className="hidden" />
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
										'text-neutral-400 hover:border-l-2 hover:border-gray-400 hover:text-black': activeMenu !== menu
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
