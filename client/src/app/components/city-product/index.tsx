import Product from '@/components/product'
import React from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

const CityProduct = () => {
	const [ref] = useKeenSlider<HTMLDivElement>({
		loop: true,
		mode: 'free',
		breakpoints: {
			'(min-width: 976px)': {
				slides: { perView: 2, spacing: 150 }
			},
			'(max-width: 976px)': {
				slides: { perView: 1, spacing: 150 }
			},
		},
	})

	return (
		<div className="keen-slider" ref={ref}>
			<Product className="keen-slider__slide" />
			<Product className="keen-slider__slide" />
		</div>
	)
}

export default CityProduct
