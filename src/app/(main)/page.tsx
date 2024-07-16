'use client'

import styles from '../../styles/styles.module.scss'
import { GoDotFill } from 'react-icons/go'
import { FaCircleDot } from 'react-icons/fa6'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import Image from 'next/image'
import Testimonials from '@/components/testimonials'
import Products from './components/products'
import CityProduct from './components/city-product'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })
const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

const Home = () => {
	return (
		<div>
			<div className={styles.mainWrapper}>
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
			<div className={styles.marqueeWrapper}>
				<div className={roboto.className}>
					Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid et optio unde id ullam quis,
					similique, voluptatum, corporis eligendi aperiam reprehenderit distinctio? Natus culpa suscipit ea
					ex quae voluptate quaerat. Quae nostrum modi dolor quasi minus, dolorum, recusandae iste optio
					facere numquam laboriosam possimus velit adipisci voluptas necessitatibus placeat tenetur harum
					corrupti repellat. Sit repellendus, in expedita odit aperiam possimus eum ad explicabo fugit ipsum
					tempora, sint sequi placeat eius culpa, pariatur voluptatum eaque eos labore unde modi. Eum
					repellendus neque nemo blanditiis autem? Placeat suscipit fugit numquam eos minus magnam ipsum,
					repellat, officiis dolores voluptatibus animi error voluptatum inventore.
				</div>
			</div>
			<div className={styles.dudeWrapper}>
				<Image src={'/assets/images/dude.webp'} alt="" height={1000} width={1000} />
			</div>
			<div className={styles.afterProductWrapper}>
				<div className={styles.header}>
					<span className={poppins.className}>FOR THE DREAMERS CITY</span>
					<span className={roboto.className}>
						Inspired by the vibrant aesthetics of the urban and the cozy spirit of a hometown.
					</span>
				</div>
				<CityProduct />
			</div>
			<div className={styles.dudeWrapper}>
				<Image src={'/assets/images/group.webp'} alt="" height={1000} width={1000} />
			</div>
			<Testimonials />
		</div>
	)
}

export default Home
