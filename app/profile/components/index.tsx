'use client'

import { Button, Divider } from '@heroui/react'
import { signOut, useSession } from 'next-auth/react'
import styles from '../styles.module.scss'
import { useEffect } from 'react'
import { getUserData } from '@/utils/request'

type Props = {}

const Profile = (props: Props) => {
	const { data: session } = useSession()
	useEffect(() => {
    console.log('session', session)
		getUserData(session?.user?.id as string)
	}, [])

	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileContainer}>
				<div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
					<div>{/* <Image src={}/> */}</div>
					<Divider />
					<Button
						onPress={() => {
							localStorage.clear()
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
