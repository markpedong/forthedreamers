import React, { FC, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa6'
import { FiUser } from 'react-icons/fi'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'

const roboto = Roboto_Condensed({ weight: ['300', '400'], subsets: ['latin'] })

const MobileMenu: FC<{ setOpen: () => void; setShowLogin: () => void }> = ({ setOpen, setShowLogin }) => {
	const { push } = useRouter()
	const [showSupport, setShowSupport] = useState(false)

	const handlePush = (path: string) => {
		setOpen()
		setShowSupport(false)
		push(path)
	}

	useLockBodyScroll()

	return (
		<motion.div
			className={classNames(styles.drawerContainer, roboto.className)}
			initial={{ opacity: 0, top: '150%%' }}
			exit={{ opacity: 0, top: '150%%' }}
			animate={{ opacity: 1, top: '5.6rem', animation: 'ease-out', transition: { duration: 0.5 } }}
		>
			<div className={styles.menuContainer}>
				<span onClick={() => handlePush('/')}>HOME</span>
				<span onClick={() => handlePush('/shop')}>SHOP</span>
				<span onClick={() => handlePush('/collection')}>COLLECTIONS</span>
				<motion.div className={styles.supportContainer}>
					<span>SUPPORT</span>
					<FaArrowRight
						onClick={() => {
							setShowSupport(true)
						}}
						color="black"
					/>
					<AnimatePresence>
						{showSupport && (
							<motion.div
								className={styles.supportMenu}
								initial={{ left: '100%' }}
								exit={{ left: '100%' }}
								animate={{ left: 0, animation: 'ease-out', transition: { duration: 0.3 } }}
							>
								<div className={styles.backContainer}>
									<FaArrowLeft onClick={() => setShowSupport(false)} />
									<p>Support</p>
								</div>
								<span onClick={() => handlePush('/support/orders-payment')}>ORDERS & PAYMENT</span>
								<span onClick={() => handlePush('/support/shipping')}>SHIPPING</span>
								<span onClick={() => handlePush('/support/returns')}>RETURNS</span>
								<span onClick={() => handlePush('/support/gift-card-manual')}>GIFT CARD MANUAL</span>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
			<div className={styles.loginBtn}>
				<FiUser size={25} color="black" />
				<motion.span whileTap={{ scale: 0.95 }} onClick={setShowLogin}>
					LOGIN
				</motion.span>
			</div>
		</motion.div>
	)
}

export default MobileMenu
