import React from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Product from '@/components/product'

const Products = () => {
	const [ref] = useKeenSlider<HTMLDivElement>({
		loop: true,
		mode: 'free',
		slides: {
			perView: 'auto',
			spacing: 300
		}
	})

	return (
		<div className="keen-slider" ref={ref}>
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
		</div>
	)
}

export default Products
