'use client'

import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import { FC, useState } from 'react'
import { CiShoppingCart } from 'react-icons/ci'
import { IoMenu, IoSearchOutline, IoClose } from 'react-icons/io5'
import styles from './style.module.scss'
import { usePathname, useRouter } from 'next/navigation'
import { useWindowScroll, useWindowSize } from '@uidotdev/usehooks'
import { FaChevronDown } from 'react-icons/fa'
import MobileMenu from './components/mobile-menu'
import { FiUser } from 'react-icons/fi'
import Search from './components/search'

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const pathname = usePathname()
	const [isHovering, setIsHovering] = useState(false)
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState(false)
	const { width } = useWindowSize()
	const [{ y }] = useWindowScroll()
	const [showDropdown, setShowDropdown] = useState(false)
	const isWhiteBG = isHovering || y! > 40
	const { push } = useRouter()

	const handlePush = (path: string) => {
		setOpen(false)
		setShowDropdown(false)
		push(path)
	}

	return (
		<motion.div
			className={styles.navbarWrapper}
			onHoverStart={() => setIsHovering(!search && true)}
			onHoverEnd={() => setIsHovering(false)}
			style={
				pathname === '/'
					? { color: isWhiteBG ? 'black' : 'white' }
					: { borderBottom: '0.1rem solid rgba(0, 0, 0, 0.2)' }
			}
		>
			<motion.div
				className={styles.background}
				initial={{ y: pathname === '/' ? '-100%' : 0 }}
				animate={pathname === '/' ? { y: isWhiteBG ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } } : {}}
			/>
			{width! > 1068 && (
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
					</motion.div>
					<AnimatePresence>
						{showDropdown && (
							<motion.div
								className={styles.dropdownMenu}
								onMouseLeave={() => setShowDropdown(false)}
								initial={{ opacity: 0 }}
								exit={{ opacity: 0 }}
								animate={{ opacity: 1, animation: 'ease-out', transition: { duration: 0.5 } }}
							>
								<span onClick={() => handlePush('/support/orders-payment')}>ORDERS & PAYMENT</span>
								<span onClick={() => handlePush('/support/shipping')}>SHIPPING</span>
								<span onClick={() => handlePush('/support/returns')}>RETURNS</span>
								<span onClick={() => handlePush('/support/gift-card-manual')}>GIFT CARD MANUAL</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
			{width! < 1069 && (
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
				<IoSearchOutline size={25} onClick={() => setSearch(true)} />
				<CiShoppingCart size={25} />
			</div>
			<AnimatePresence>{search && <Search setSearch={() => setSearch(false)} />}</AnimatePresence>
		</motion.div>
	)
}

export default Navbar
