'use client'

import { clearUserData } from '@/lib'
import { Button, Divider } from '@heroui/react'
import { Users } from '@prisma/client'
import { signOut, useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import styles from '../styles.module.scss'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { getUserData } from '@/utils/request'

const PersonalInformation = dynamic(() => import('./personal-information'), { ssr: false })
const Addresses = dynamic(() => import('./addresses'), { ssr: false })
const PaymentMethods = dynamic(() => import('./payment-methods'), { ssr: false })
const Orders = dynamic(() => import('./orders'), { ssr: false })
const Reviews = dynamic(() => import('./reviews'), { ssr: false })

const Profile: FC<{ data: Users }> = ({ data }) => {
	const menus = ['Personal Information', 'Addresses', 'Payment Methods', 'Orders', 'Wishlist', 'Reviews']
	const [activeMenu, setActiveMenu] = useState<string | null>(null)

	console.log("data", data)

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
							{data?.image && <Image src={data?.image} alt="" width={50} height={50} className="rounded-full" />}
							<span className="capitalize pt-2">
								{data?.firstName} {data?.lastName}
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
