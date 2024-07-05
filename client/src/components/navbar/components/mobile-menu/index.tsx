import React, { FC, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa6'
import { FiUser } from 'react-icons/fi'

const MobileMenu: FC<{ setOpen: () => void }> = ({ setOpen }) => {
	const { push } = useRouter()
	const [showSupport, setShowSupport] = useState(false)

	const handlePush = (path: string) => {
		setOpen()
		setShowSupport(false)
		push(path)
	}

	useLockBodyScroll()

	return (
		<>
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
								<span onClick={() => handlePush("/support/orders-payment")}>ORDERS & PAYMENT</span>
								<span>SHIPPING</span>
								<span>RETURNS</span>
								<span>GIFT CARD</span>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
			<div className={styles.loginBtn}>
				<FiUser size={25} color='black'/>
				<span>LOGIN</span>
			</div>
		</>
	)
}

export default MobileMenu
