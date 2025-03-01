'use client'

import { Button, Divider, Image } from '@heroui/react'
import { signOut } from 'next-auth/react'
import styles from '../styles.module.scss'
import { Users } from '@prisma/client'
import { FC } from 'react'
import { clearUserData } from '@/lib'

type Props = {
	data: Users
}

const Profile: FC<Props> = ({ data }) => {
	console.log("data", data)
	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileContainer}>
				<div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
					<div>
						<Image src={`${data?.image}`} alt="" width={100} height={100} className="rounded-full" />
					</div>
					<Divider />
					<Button
						onPress={() => {
							clearUserData()
							signOut()
						}}
					>
						Signout
					</Button>
				</div>
				<div>Profile</div>
			</div>
		</div>
	)
}

export default Profile
