'use client'

import React, { useState } from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { IoLogoFacebook, IoLogoInstagram, IoLogoPinterest } from 'react-icons/io'
import { FaTiktok } from 'react-icons/fa'
import { Button, Dropdown } from 'antd'
import { FaMinus, FaPlus, FaAngleDown } from 'react-icons/fa6'
import { AnimatePresence, motion } from 'framer-motion'
import { useMediaQuery } from '@uidotdev/usehooks'

const roboto = Roboto_Condensed({ weight: ['300', '400', '500', '800'], subsets: ['latin'] })

const Footer = () => {
	const [open, setOpen] = useState(false)
	const small = useMediaQuery('only screen and (min-width : 993px)')

	return (
		<div className={classNames(styles.footerContainer, roboto.className)}>
			<div className={styles.footerWrapper}>
				<div>
					<h2>
						SUPPORT
						{!small && open ? <FaMinus className={styles.minusIcon} onClick={() => setOpen(false)} /> : <FaPlus className={styles.plusIcon} onClick={() => setOpen(true)} />}
					</h2>
					<AnimatePresence>
						{(open || small) && (
							<motion.div
								className={styles.menuContainer}
								initial={{ opacity: 0, height: 0, y: -10 }}
								animate={{ opacity: 1, height: 'auto', y: 0 }}
								exit={{ opacity: 0, height: 0, y: -10 }}
								transition={{ duration: 0.3 }}
							>
								<span>Search</span>
								<span>Orders & Payment</span>
								<span>Shipping</span>
								<span>Returns</span>
								<span>Contact Us</span>
								<span>Terms and Service</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<div>
					<h2>MADE IN THE PHILIPPINES</h2>
					<div className={styles.socmedContainer}>
						<IoLogoFacebook />
						<IoLogoInstagram />
						<IoLogoPinterest />
						<FaTiktok />
					</div>
				</div>
			</div>
			<div>
				<div className={styles.dropdownContainer}>
					<motion.div>
						<span>English</span>
						<FaAngleDown />
					</motion.div>
					<motion.div>
						<span>Philippines (PHP ₱)</span>
						<FaAngleDown />
					</motion.div>
				</div>
				<span className={styles.tradeMark}>© 2024 FOR THE DREAMERS, All rights reserved. Powered by Shopify</span>
			</div>
		</div>
	)
}

export default Footer
