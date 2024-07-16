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
import Cart from './components/cart'
import Marquee from 'react-fast-marquee'
import Login from './components/login'

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: '300', subsets: ['latin'] })

const Navbar: FC = () => {
	const pathname = usePathname()
	const [isHovering, setIsHovering] = useState(false)
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState(false)
	const [showCart, setShowCart] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const { width } = useWindowSize()
	const [{ y }] = useWindowScroll()
	const [showDropdown, setShowDropdown] = useState(false)
	const isWhiteBG = isHovering || y! > 40
	const { push, refresh } = useRouter()

	const handlePush = (path: string) => {
		setOpen(false)
		setShowDropdown(false)
		push(path)
		refresh()
	}

	return (
		<>
			{pathname !== '/' && (
				<Marquee
					className={classNames(roboto.className, 'bg-black text-white py-2 font-normal tracking-wide')}
					direction="right"
				>
					<span className="text-[0.82rem]">
						Same Day Delivery is unavailable today due to our ongoing free shipping promo.
					</span>
				</Marquee>
			)}
			<motion.div
				className={styles.navbarWrapper}
				onHoverStart={() => setIsHovering(!search && true)}
				onHoverEnd={() => setIsHovering(false)}
				style={
					pathname === '/'
						? { color: isWhiteBG ? 'black' : 'white' }
						: { borderBottom: '0.1rem solid rgba(0, 0, 0, 0.2)', top: y! > 15 ? 0 : 40 }
				}
			>
				<motion.div
					className={styles.background}
					initial={{ y: pathname === '/' ? '-100%' : 0 }}
					animate={
						pathname === '/'
							? { y: isWhiteBG ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } }
							: {}
					}
				/>
				{width! > 992 && (
					<div className={classNames(styles.leftBtnWrapper, roboto.className)}>
						<span onClick={() => handlePush('/')}>HOME</span>
						<span onClick={() => handlePush('/shop')}>SHOP</span>
						<span onClick={() => handlePush('/collection')}>COLLECTIONS</span>
						<motion.div className={styles.supportContainer} onClick={() => handlePush('/support')}>
							<span
								onMouseEnter={() => {
									setShowDropdown(true)
								}}
							>
								SUPPORT
							</span>
							<FaChevronDown />
						</motion.div>
					</div>
				)}
				{width! < 993 && (
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
								<MobileMenu
									setOpen={() => setOpen(false)}
									setShowLogin={() => {
										setOpen(false)
										setShowLogin(true)
									}}
								/>
							)}
						</AnimatePresence>
					</div>
				)}
				<div className={classNames(styles.navTitle, poppins.className)}>FOR THE DREAMERS</div>
				<div className={classNames(styles.rightBtnWrapper, roboto.className)}>
					<div className={styles.loginBtn}>
						<span
							onClick={() => {
								setOpen(false)
								setShowCart(false)
								setShowLogin(true)
								setSearch(false)
							}}
						>
							LOGIN
						</span>
						<FiUser size={25} />
					</div>
					<IoSearchOutline
						size={25}
						onClick={() => {
							setOpen(false)
							setShowCart(false)
							setShowLogin(false)
							setSearch(true)
						}}
					/>
					<CiShoppingCart
						size={25}
						onClick={() => {
							setOpen(false)
							setShowCart(true)
							setShowLogin(false)
							setSearch(false)
						}}
					/>
				</div>
				<AnimatePresence>{showCart && <Cart setShowCart={() => setShowCart(false)} />}</AnimatePresence>
				<AnimatePresence>{search && <Search setSearch={() => setSearch(false)} />}</AnimatePresence>
				<AnimatePresence>
					{showLogin && (
						<Login
							setShowLogin={() => {
								if (width! < 992) {
									setOpen(true)
								}

								setShowLogin(false)
							}}
						/>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{width! > 1068 && showDropdown && (
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
			</motion.div>
		</>
	)
}

export default Navbar
