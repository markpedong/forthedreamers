import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

type Props = {}

const Home = (props: Props) => {
	return (
		<div className="max-w-7xl mx-auto h-screen px-12 py-6 relative">
			<div className="flex justify-center items-center flex-col h-[75%] text-center gap-8 z-10 relative">
				<h1 className="text-6xl font-bold backdrop-blur-lg rounded-md">
					Cultivate Joy <br /> with Every Shirt
				</h1>
				<span className="text-md backdrop-blur-lg rounded-md">
					Discover the art of green living with our curated selection <br /> of shirts and mindful care essentials.
				</span>
				<div className="flex items-center justify-center gap-2 border border-black py-2 px-4 cursor-pointer bg-white text-black hover:bg-black hover:text-white transition-all">
					<span className="text-sm">Explore our Products</span>
					<FaArrowRight size={12} />
				</div>
			</div>
			<Image
				src="/images/shirt1.png"
				alt="shirt1"
				width={240}
				height={240}
				className="absolute right-0 top-1/2 rounded-sm"
				sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
			/>
			<Image
				src="/images/shirt2.png"
				alt="shirt2"
				width={150}
				height={150}
				className="absolute left-0 top-[15%] rounded-sm"
				sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
			/>
			<Image
				src="/images/shirt3.png"
				alt="shirt3"
				width={150}
				height={150}
				className="md:absolute left-0 top-3/4 rounded-sm md:block hidden"
				sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
			/>
			<Image
				src="/images/shirt4.png"
				alt="shirt4"
				width={150}
				height={150}
				className="md:absolute right-[35%] top-[-10%] rounded-sm md:block hidden"
				sizes="(max-width: 600px) 5vw, (max-width: 1024px) 33vw, 240px"
			/>
		</div>
	)
}

export default Home
