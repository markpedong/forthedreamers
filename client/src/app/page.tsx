'use client'

import Navbar from '@/components/navbar'
import styles from '../styles/styles.module.scss'
import { GoDotFill } from 'react-icons/go'
import { FaCircleDot } from 'react-icons/fa6'
import { Roboto_Condensed } from 'next/font/google'
import Products from '@/components/products'
import classNames from 'classnames'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Home = () => {
	return (
		<div>
			<div className={styles.mainWrapper}>
				<Navbar />
				<div className={styles.timelessContainer}>
					<span>timeless silhouettes</span>
					<span className={roboto.className}>live now</span>
					<div>
						<FaCircleDot />
						<GoDotFill />
					</div>
				</div>
			</div>
			<Products />
			<div className={styles.wrapper}>
				<div className={classNames(styles.marquee, roboto.className)}>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce volutpat, ante eu bibendum tincidunt, sem
						lacus vehicula augue, ut suscipit.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce volutpat, ante eu bibendum tincidunt, sem
						lacus vehicula augue, ut suscipit.
					</p>
				</div>
			</div>
		</div>
	)
}

export default Home
