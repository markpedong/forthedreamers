'use client'
import React, { FC, useEffect, useState } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { IoMdClose } from 'react-icons/io'
import { FcGoogle } from 'react-icons/fc'
import { handleGoogleSignin } from '@/lib/auth/googleSignInServerAction'
import { LOGIN_STATE } from '@/app/(main)/constants/enums'

const inter = Inter({ weight: ['300', '400', '800'], subsets: ['latin'] })

const Login: FC<{ setShowLogin: () => void }> = ({ setShowLogin }) => {
	const [loginState, setLoginState] = useState(LOGIN_STATE.LOGIN)

	useEffect(() => {
		setTimeout(() => {
			document.body.style.overflow = 'hidden'
		}, 400)

		return () => {
			document.body.style.overflow = ''
		}
	}, [])

	return (
		<>
			<div className={styles.BG} />
			<div className={classNames(styles.mainContainer, inter.className)}>
				<IoMdClose className={styles.closeBtn} onClick={setShowLogin} size={30} color="black" />
				<Image
					className={styles.imgCover}
					src={`/assets/images/modalCover${
						loginState === LOGIN_STATE.LOGIN ? '1' : loginState === LOGIN_STATE.REGISTER ? '2' : '3'
					}.webp`}
					alt="modal__cover"
					height={300}
					width={300}
				/>
				<div className={styles.login}>
					{loginState === LOGIN_STATE.LOGIN && (
						<>
							<span className={styles.login__header}>Login</span>
							<span className={styles.login__sub}>Enter your credentials to continue Shopping!</span>
							<span className={styles.login__label}>Email</span>
							<input type="text" />
							<span className={styles.login__label}>Password</span>
							<input type="password" />
							<div className="flex justify-between w-full pt-1 text-[1rem]">
								<span
									className="capitalize text-red-500 font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.FORGOT)}
								>
									forgot password?
								</span>
								<span
									className="capitalize text-black font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.REGISTER)}
								>
									Create Account
								</span>
							</div>
							<div className={styles.btn}>Login</div>
							<motion.div
								className={styles.googleBtnContainer}
								whileTap={{ scale: 0.9 }}
								onClick={() => handleGoogleSignin()}
							>
								<FcGoogle />
								<span>Google</span>
							</motion.div>
						</>
					)}
					{loginState === LOGIN_STATE.REGISTER && (
						<>
							<span className={styles.login__header}>Register</span>
							<span className={styles.login__sub}>Create your account to continue Shopping!</span>
							<span className={styles.login__label}>Email</span>
							<input type="text" />
							<span className={styles.login__label}>Password</span>
							<input type="password" />
							<div className="flex justify-between w-full pt-1 text-[1rem]">
								<span
									className="capitalize text-red-500 font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.FORGOT)}
								>
									forgot password?
								</span>
								<span
									className="capitalize text-black font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.LOGIN)}
								>
									Already have an account?
								</span>
							</div>
							<div className={styles.btn}>Register</div>
							<motion.div
								className={styles.googleBtnContainer}
								whileTap={{ scale: 0.9 }}
								onClick={() => handleGoogleSignin()}
							>
								<FcGoogle />
								<span>Google</span>
							</motion.div>
						</>
					)}
					{loginState === LOGIN_STATE.FORGOT && (
						<>
							<span className={styles.login__header}>Forgot Password</span>
							<span className={styles.login__label}>Email</span>
							<input type="text" />
							<div className="flex justify-between w-full pt-1 text-[1rem]">
								<span
									className="capitalize text-zinc-800 font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.LOGIN)}
								>
									login
								</span>
								<span
									className="capitalize text-blue-800 font-bold mt-1"
									onClick={() => setLoginState(LOGIN_STATE.LOGIN)}
								>
									create new account
								</span>
							</div>
							<div className={styles.btn}>Send OTP</div>
						</>
					)}
				</div>
			</div>
		</>
	)
}

export default Login
