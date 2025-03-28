'use client'

import Image from 'next/image'
import { FC } from 'react'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import TrendingNow from './trending-now'
import NewsLetter from '@/components/newsletter'
import { Products } from '@prisma/client'
import { TProductItem } from '@/constants/types'
import { useRouter } from 'next/navigation'

const Home: FC<{ products: TProductItem[] }> = ({ products }) => {
	const imageVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	}
	const { push } = useRouter()

	return (
		<>
			<div className="max-w-7xl mx-auto p-12 py-16 relative h-[90vh]">
				<div className="flex justify-center items-center flex-col text-center gap-8 z-10 relative my-24 h-[70%]">
					<h1 className="text-6xl font-bold backdrop-blur-lg rounded-md">
						Cultivate Joy <br /> with Every Shirt
					</h1>
					<span className="text-md backdrop-blur-lg rounded-md">
						Discover the art of green living with our curated selection <br /> of shirts and mindful care essentials.
					</span>
					<div
						className="flex items-center justify-center gap-2 border border-black py-2 px-4 cursor-pointer bg-white text-black hover:bg-black hover:text-white transition-all"
						onClick={() => push('/shop')}
					>
						<span className="text-sm">Explore our Products</span>
						<Icon icon="icon-park-outline:right" />
					</div>
				</div>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={imageVariants}
					transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
					className="absolute right-0 top-[10%] rounded-sm"
				>
					<Image
						src="/images/shirt1.png"
						alt="shirt1"
						width={240}
						height={240}
						sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
					/>
				</motion.div>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={imageVariants}
					transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
					className="absolute left-0 top-[15%] rounded-sm"
				>
					<Image
						src="/images/shirt2.png"
						alt="shirt2"
						width={150}
						height={150}
						sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
					/>
				</motion.div>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={imageVariants}
					transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
					className="md:absolute left-0 top-[60%] rounded-sm md:block hidden"
				>
					<Image
						src="/images/shirt3.png"
						alt="shirt3"
						width={150}
						height={150}
						sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
					/>
				</motion.div>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={imageVariants}
					transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
					className="md:absolute right-[35%] top-[-5%] rounded-sm md:block hidden"
				>
					<Image
						src="/images/shirt4.png"
						alt="shirt4"
						width={150}
						height={150}
						sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
					/>
				</motion.div>
			</div>
			{products.length > 0 && <TrendingNow products={products} />}
			<NewsLetter />
		</>
	)
}

export default Home
