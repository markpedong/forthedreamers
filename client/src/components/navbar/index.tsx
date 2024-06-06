'use client'

import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import styles from './style.module.scss'
import { IoSearchOutline } from 'react-icons/io5'
import { CiShoppingCart } from 'react-icons/ci'
import { Inter, Poppins, Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'

const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const [isHovering, setIsHovering] = useState(false)
	const [scroll, setScroll] = useState(0)
	const q = isHovering || scroll > 40

	useEffect(() => {
		const handleScroll = () => {
			setScroll(window.scrollY)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return (
		<motion.div
			className={styles.navbarWrapper}
			onHoverStart={() => setIsHovering(true)}
			onHoverEnd={() => setIsHovering(false)}
			style={{ color: q ? 'black' : 'white' }}
		>
			<motion.div
				className={styles.background}
				initial={{ y: '-100%' }}
				animate={{ y: q ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } }}
			/>
			<div className={classNames(styles.leftBtnWrapper, roboto.className)}>
				<span>HOME</span>
				<span>SHOP</span>
				<span>COLLECTIONS</span>
				<span>SUPPORT</span>
			</div>
			<div className={classNames(styles.navTitle, poppins.className)}>FOR THE DREAMERS</div>
			<div className={classNames(styles.rightBtnWrapper, roboto.className)}>
				<span>LOGIN</span>
				<IoSearchOutline />
				<CiShoppingCart />
			</div>
		</motion.div>
	)
}

export default Navbar
