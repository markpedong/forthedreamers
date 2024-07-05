'use client'

import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import { FC, useEffect, useState } from 'react'
import { CiShoppingCart } from 'react-icons/ci'
import { IoMenu, IoSearchOutline, IoClose } from 'react-icons/io5'
import styles from './style.module.scss'
import { usePathname, useRouter } from 'next/navigation'
import { useWindowSize } from '@uidotdev/usehooks'
import { FaChevronDown } from 'react-icons/fa'
import MobileMenu from './components/mobile-menu'
import { FiUser } from 'react-icons/fi'

const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const pathname = usePathname()
	const [isHovering, setIsHovering] = useState(false)
	const [scroll, setScroll] = useState(0)
	const [open, setOpen] = useState(false)
	const { width } = useWindowSize()
	const [showDropdown, setShowDropdown] = useState(false)
	const isWhiteBG = isHovering || scroll > 40
	const { push } = useRouter()

	const handlePush = (path: string) => {
		setOpen(false)
		setShowDropdown(false)
		push(path)
	}

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
			style={pathname === '/' ? { color: isWhiteBG ? 'black' : 'white' } : { borderBottom: '0.1rem solid rgba(0, 0, 0, 0.2)' }}
		>
			<motion.div
				className={styles.background}
				initial={{ y: pathname === '/' ? '-100%' : 0 }}
				animate={pathname === '/' ? { y: isWhiteBG ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } } : {}}
			/>
			{width && width > 1068 && (
				<div className={classNames(styles.leftBtnWrapper, roboto.className)}>
					<span onClick={() => handlePush('/')}>HOME</span>
					<span onClick={() => handlePush('/shop')}>SHOP</span>
					<span onClick={() => handlePush('/collection')}>COLLECTIONS</span>
					<motion.div className={styles.supportContainer} onClick={() => push('/support')}>
						<span
							onMouseEnter={() => {
								setShowDropdown(true)
							}}
						>
							SUPPORT
						</span>
						<FaChevronDown />
						<AnimatePresence>
							{showDropdown && (
								<motion.div
									className={styles.dropdownMenu}
									onMouseLeave={() => setShowDropdown(false)}
									initial={{ opacity: 0 }}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1, animation: 'ease-out', transition: { duration: 0.5 } }}
								>
									<span>ORDERS & PAYMENT</span>
									<span>SHIPPING</span>
									<span>RETURNS</span>
									<span>GIFT CARD</span>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			)}
			{width && width < 1068 && (
				<div className={styles.mobileBtnWrapper}>
					{open && <IoClose onClick={() => setOpen(false)} size={30} />}
					{!open && (
						<IoMenu
							onClick={() => {
								setOpen(true)
							}}
							size={30}
						/>
					)}
					<AnimatePresence>
						{open && (
							<motion.div
								className={classNames(styles.drawerContainer, roboto.className)}
								initial={{ opacity: 0, top: '150%%' }}
								exit={{ opacity: 0, top: '150%%' }}
								animate={{ opacity: 1, top: '101%', animation: 'ease-out', transition: { duration: 0.5 } }}
							>
								<MobileMenu setOpen={() => setOpen(false)} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
			<div className={classNames(styles.navTitle, poppins.className)}>FOR THE DREAMERS</div>
			<div className={classNames(styles.rightBtnWrapper, roboto.className)}>
				<div className={styles.loginBtn}>
					<span>LOGIN</span>
					<FiUser size={25} />
				</div>
				<IoSearchOutline size={25} />
				<CiShoppingCart size={25} />
			</div>
		</motion.div>
	)
}

export default Navbar
