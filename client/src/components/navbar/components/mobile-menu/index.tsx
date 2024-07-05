import React, { FC, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { useRouter } from 'next/navigation'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { FaArrowRight } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa6'

const roboto = Roboto_Condensed({ weight: ['400', '300'], subsets: ['latin'] })

const MobileMenu: FC<{ open: boolean }> = ({ open }) => {
	const { push } = useRouter()
	const [showSupport, setShowSupport] = useState(false)

	useLockBodyScroll()

	useEffect(() => {
		return () => {
			setShowSupport(false)
		}
	}, [open])

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className={classNames(styles.drawerContainer, roboto.className)}
					initial={{ opacity: 0, top: '150%%' }}
					exit={{ opacity: 0, top: '150%%' }}
					animate={{ opacity: 1, top: '101%', animation: 'ease-out', transition: { duration: 0.5 } }}
				>
					<span onClick={() => push('/')}>HOME</span>
					<span onClick={() => push('/shop')}>SHOP</span>
					<span onClick={() => push('/collection')}>COLLECTIONS</span>
					<motion.div className={styles.supportContainer} onClick={() => push('/support')}>
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
									<span>ORDERS & PAYMENT</span>
									<span>SHIPPING</span>
									<span>RETURNS</span>
									<span>GIFT CARD</span>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default MobileMenu
