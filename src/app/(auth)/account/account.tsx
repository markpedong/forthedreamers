'use client'

import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import React from 'react'
import styles from './styles.module.scss'
import { PageTitle } from '@/components/page-components'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleSignout } from '@/lib/auth/signOutServerAction'

const roboto = Roboto_Condensed({ weight: ['200', '300', '400', '500', '600', '800'], subsets: ['latin'] })

const AccountPage = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<h1>SAMPLE SIGNOUT BUTTON</h1>
			<button onClick={() => handleSignout()}>SIGNOUT BUTTON</button>
			<PageTitle title="account" medium className="!capitalize" />
			<div className={styles.details}>
				<Image src={'/assets/images/dog.jpg'} alt="dog" width={100} height={100} />
				<div className={styles.details__container}>
					<div className={styles.details__label}>Full Name</div>
					<div className={styles.twoInputContainer}>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="first_name">First Name</Label>
							<Input type="first_name" id="first_name" placeholder="eg: John" value="John" />
						</div>{' '}
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="last_name">Last Name</Label>
							<Input type="last_name" id="last_name" placeholder="eg: Doe" value="Doe" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AccountPage
