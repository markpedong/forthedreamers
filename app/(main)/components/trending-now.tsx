'use client'

import Product from '@/components/product'
import { useKeenSlider } from 'keen-slider/react'

type Props = {}

const TrendingNow = (props: Props) => {
	const [ref] = useKeenSlider<HTMLDivElement>({
		slides: {
			perView: 5,
			spacing: 15
		},
		breakpoints: {
			'(max-width: 992px)': {
				slides: {
					perView: 3
				}
			},
			'(max-width: 768px)': {
				slides: {
					perView: 2
				}
			},
			'(max-width: 576px)': {
				slides: {
					perView: 1
				}
			}
		}
	})

	return (
		<div className="max-w-5xl mx-auto">
			<div className='text-3xl font-bold'>FOR THE DREAMERS CITY</div>
			<div className='text-sm'>Inspired by the vibrant aesthetics of the urban and the cozy spirit of a hometown.</div>
			<div className='my-10'/>
			<div ref={ref} className="keen-slider">
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
				<Product />
			</div>
		</div>
	)
}

export default TrendingNow
