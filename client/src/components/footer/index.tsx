import React from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { IoLogoFacebook, IoLogoInstagram, IoLogoPinterest } from 'react-icons/io'
import { FaTiktok } from 'react-icons/fa'
import { Button, Dropdown } from 'antd'

const roboto = Roboto_Condensed({ weight: ['300', '400', '500', '800'], subsets: ['latin'] })

const Footer = () => {
	return (
		<div className={classNames(styles.footerContainer, roboto.className)}>
			<div className={styles.footerWrapper}>
				<div>
					<h2>SUPPORT</h2>
					<div className={styles.menuContainer}>
						<span>Search</span>
						<span>Orders & Payment</span>
						<span>Shipping</span>
						<span>Returns</span>
						<span>Contact Us</span>
						<span>Terms and Service</span>
					</div>
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
					<Dropdown menu={{ items: [] }} placement="bottomLeft" arrow>
						<Button>bottomLeft</Button>
					</Dropdown>
					<Dropdown menu={{ items: [] }} placement="bottomLeft" arrow>
						<Button>bottomLeft</Button>
					</Dropdown>
				</div>
				<span className={styles.tradeMark}>© 2024 FOR THE DREAMERS, All rights reserved. Powered by Shopify</span>
			</div>
		</div>
	)
}

export default Footer
