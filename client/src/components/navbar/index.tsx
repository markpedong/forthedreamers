'use client'

import useWindowWidth from '@/hooks/useWindowWidth'
import { Drawer } from 'antd'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import { FC, useEffect, useState } from 'react'
import { CiShoppingCart } from 'react-icons/ci'
import { IoMenu, IoSearchOutline } from 'react-icons/io5'
import styles from './style.module.scss'

const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const [isHovering, setIsHovering] = useState(false)
	const [scroll, setScroll] = useState(0)
	const [open, setOpen] = useState(false)
	const windowWidth = useWindowWidth()
	const isWhiteBG = isHovering || scroll > 40

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
		<div>
			<motion.div
				className={styles.navbarWrapper}
				onHoverStart={() => setIsHovering(true)}
				onHoverEnd={() => setIsHovering(false)}
				style={{ color: isWhiteBG ? 'black' : 'white' }}
			>
				<motion.div
					className={styles.background}
					initial={{ y: '-100%' }}
					animate={{ y: isWhiteBG ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } }}
				/>
				{windowWidth > 1068 && (
					<div className={classNames(styles.leftBtnWrapper, roboto.className)}>
						<span>HOME</span>
						<span>SHOP</span>
						<span>COLLECTIONS</span>
						<span>SUPPORT</span>
					</div>
				)}
				{windowWidth < 1068 && (
					<div className={styles.mobileBtnWrapper}>
						<IoMenu
							onClick={() => {
								setOpen(true)
							}}
							size={30}
						/>
						<Drawer
							title="Basic Drawer"
							placement="bottom"
							open={open}
							onClose={() => {
								setOpen(false)
							}}
						></Drawer>
					</div>
				)}
				<div className={classNames(styles.navTitle, poppins.className)}>FOR THE DREAMERS</div>
				<div className={classNames(styles.rightBtnWrapper, roboto.className)}>
					<span>LOGIN</span>
					<IoSearchOutline />
					<CiShoppingCart />
				</div>
			</motion.div>
		</div>
	)
}

export default Navbar
