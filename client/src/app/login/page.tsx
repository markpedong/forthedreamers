'use client'
import React from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { GoogleSignInButton } from 'firebase-nextjs/client/components'
import GOOGLE from '../../../public/assets/images/google.svg'
import { motion } from 'framer-motion'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const Page = () => {	
	return (
		<div className={styles.mainWrapper}>
			<div className={classNames(styles.login, roboto.className)}>
				<Image src={'/assets/images/dog.jpg'} alt="dog" width={100} height={100} />
				<span className={styles.login__header}>Login</span>
				<span className={styles.login__sub}>Enter your email and we'll send you a login code</span>
				<span className={styles.login__label}>Email</span>
				<input type="text" />
				<div className={styles.btn}>Continue</div>
				<GoogleSignInButton>
					<motion.div className={styles.googleBtnContainer} whileTap={{ scale: 0.9 }}>
						<Image src={GOOGLE} alt="google" width={100} height={100} />
						<span>Log in with Google</span>
					</motion.div>
				</GoogleSignInButton>
			</div>
		</div>
	)
}

export default Page
