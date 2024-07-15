import React, { FC } from 'react'
import { motion } from 'framer-motion'
import styles from './styles.module.scss'

const Drawer: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className={styles.wrapper}>
			<motion.div
				className={styles.BG}
				initial={{ opacity: 0 }}
				exit={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeIn' } }}
			/>
			<motion.div
				className={styles.drawerWrapper}
				initial={{ x: 100, opacity: 0 }}
				exit={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1, transition: { duration: 0.1, ease: 'easeIn' } }}
			>
				{children}
			</motion.div>
		</div>
	)
}

export default Drawer
