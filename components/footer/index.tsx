'use client'

import { FOOTER_TITLE, NO_NAVBAR_FOOTER_PAGES } from '@/constants'
import { Divider, Input, Link } from '@heroui/react'
import styles from '../styles.module.scss'
import { IoSend } from 'react-icons/io5'
import { QRCode } from 'antd'
import Image from 'next/image'
import { FaFacebookF, FaGoogle, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/redux/store'

const Footer = () => {
	const pathname = usePathname()
	const darkMode = useAppSelector(state => state.app.darkMode)
	return (
		!NO_NAVBAR_FOOTER_PAGES.includes(pathname) && (
			<>
				<Divider />
				<div className={styles.footerWrapper}>
					<div className="w-full p-6">
						<div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-10">
							<div>
								<Link className="font-bold" color="foreground" size="lg">
									Exclusive
								</Link>
								<div className="mt-4">
									<h1>Subscribe</h1>
									<div className="text-xs mt-5 mb-3">Get 10% off your first order</div>
									<Input
										endContent={<IoSend size={12} />}
										variant="bordered"
										size="sm"
										placeholder="Enter your email"
										radius="none"
									/>
								</div>
							</div>
							<div>
								<Link className="font-bold" color="foreground" size="lg">
									Support
								</Link>
								<div className="mt-4 *:text-typography-1 *:text-xs *:mb-3">
									<div>111 Gentri Cavite</div>
									<div>forthedreamers@gmail.com</div>
									<div>+63 123 456 789</div>
								</div>
							</div>
							<div>
								<Link className="font-bold" color="foreground" size="lg">
									Account
								</Link>
								<div className="mt-4 *:text-typography-1 *:text-xs *:mb-3">
									<div>My Account</div>
									<div>Login / Register</div>
									<div>Cart</div>
									<div>Wishlist</div>
									<div>Shop</div>
								</div>
							</div>
							<div>
								<Link className="font-bold" color="foreground" size="lg">
									Quick Link
								</Link>
								<div className="mt-4 *:text-typography-1 *:text-xs *:mb-3">
									<div>Privacy Policy</div>
									<div>Terms of Use</div>
									<div>FAQ</div>
									<div>Contact</div>
								</div>
							</div>
							<div>
								<Link className="font-bold" color="foreground" size="lg">
									Download App
								</Link>
								<div className="mt-4">
									<div className="text-typography-1 text-xs mb-3">Save $3 with App, new user only</div>
									<div className="flex justify-between gap-2 mb-3">
										<QRCode
											value={'test'}
											size={75}
											errorLevel="M"
											className="footer-qr"
											bgColor={darkMode ? 'black' : 'white'}
										/>
										<div className="flex flex-col justify-around">
											<Image src={'/images/googleplay.png'} width={100} height={100} alt="googleplay" priority />
											<Image src={'/images/appstore.png'} width={100} height={100} alt="appstore" priority />
										</div>
									</div>
									<div className="flex gap-5 mt-5">
										<FaFacebookF size={15} />
										<FaGoogle size={15} />
										<FaInstagram size={15} />
										<FaLinkedin size={15} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	)
}

export default Footer
