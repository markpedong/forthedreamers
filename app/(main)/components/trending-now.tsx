'use client'

import Product from '@/components/product'
import { Typography } from 'antd'
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
		<div className="max-w-7xl mx-auto px-2">
			<Typography.Title level={1}>TRENDING NOW</Typography.Title>
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
