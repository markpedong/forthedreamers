'use client'

import { Button, Divider } from '@heroui/react'
import { signOut, useSession } from 'next-auth/react'
import styles from './styles.module.scss'

type Props = {}

const Page = (props: Props) => {
	const { data: session } = useSession()
	console.log('session', session)
	return (
		<div className={styles.profileWrapper}>
			<div className={styles.profileContainer}>
				<div className="border-r-1 h-full border-[rgba(0, 0, 0, 0.1)]">
					<div>{/* <Image src={}/> */}</div>
					<Divider />
					<Button onPress={() => signOut()}>Signout</Button>
				</div>
				<div>Profile</div>
			</div>
		</div>
	)
}

export default Page
