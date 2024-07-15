'use client'
import React, { FC } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { GoogleSignInButton } from 'firebase-nextjs/client/components'
import GOOGLE from '../../../../../public/assets/images/google.svg'
import { motion } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const Login: FC<{ setShowLogin: () => void }> = ({ setShowLogin }) => {

	return (
		<>
			<div className={styles.BG} />
			<div className={classNames(styles.mainContainer, roboto.className)}>
				<IoMdClose className={styles.closeBtn} onClick={setShowLogin} size={30} color="black" />
				<Image
					className={styles.imgCover}
					src={'/assets/images/modalCover1.webp'}
					alt="modal__cover"
					height={300}
					width={300}
				/>
				<div className={styles.login}>
					<span className={styles.login__header}>Login</span>
					<span className={styles.login__sub}>Enter your credentials to continue Shopping!</span>
					<span className={styles.login__label}>Email</span>
					<input type="text" />
					<span className={styles.login__label}>Password</span>
					<input type="password" />
					<div className={styles.btn}>Continue</div>
					<GoogleSignInButton className="w-full">
						<motion.div className={styles.googleBtnContainer} whileTap={{ scale: 0.9 }}>
							<Image src={GOOGLE} alt="google" width={100} height={100} />
							<span>Log in with Google</span>
						</motion.div>
					</GoogleSignInButton>
				</div>
			</div>
		</>
	)
}

export default Login
