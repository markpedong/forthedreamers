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
import { usePathname, useRouter } from 'next/navigation'

const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const pathname = usePathname()
	const [isHovering, setIsHovering] = useState(false)
	const [scroll, setScroll] = useState(0)
	const [open, setOpen] = useState(false)
	const { width } = useWindowWidth()
	const isWhiteBG = isHovering || scroll > 40
	const { push } = useRouter()

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
			style={pathname === '/' ? { color: isWhiteBG ? 'black' : 'white' } : {}}
		>
			<motion.div
				className={styles.background}
				initial={{ y: '-100%' }}
				animate={{ y: isWhiteBG ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } }}
			/>
			{width > 1068 && (
				<div className={classNames(styles.leftBtnWrapper, roboto.className)}>
					<span onClick={() => push('/')}>HOME</span>
					<span onClick={() => push('/shop')}>SHOP</span>
					<span onClick={() => push('/collections')}>COLLECTIONS</span>
					<span onClick={() => push('/support')}>SUPPORT</span>
				</div>
			)}
			{width < 1068 && (
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
					/>
				</div>
			)}
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
