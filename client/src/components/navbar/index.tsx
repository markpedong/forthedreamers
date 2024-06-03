'use client'

import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import styles from './style.module.scss'
import { IoSearchOutline } from 'react-icons/io5'
import { CiShoppingCart } from 'react-icons/ci'

const Navbar: FC = () => {
	const [isHovering, setIsHovering] = useState(false)
	return (
		<motion.div
			className={styles.navbarWrapper}
			onHoverStart={() => setIsHovering(true)}
			onHoverEnd={() => setIsHovering(false)}
		>
			<motion.div
				className={styles.background}
				initial={{ y: '-100%' }}
				animate={{ y: isHovering ? 0 : '-100%', transition: { duration: 0.15, ease: 'easeIn' } }}
			/>
			<div className={styles.leftBtnWrapper}>
				<span>HOME</span>
				<span>SHOP</span>
				<span>COLLECTIONS</span>
				<span>SUPPORT</span>
			</div>
			<div>FOR THE DREAMERS</div>
			<div className={styles.rightBtnWrapper}>
				<span>LOGIN</span>
				<IoSearchOutline />
				<CiShoppingCart />
			</div>
		</motion.div>
	)
}

export default Navbar
