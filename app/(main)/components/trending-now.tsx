'use client'
import Product from '@/components/product'
import { Typography } from 'antd'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

type Props = {}

const TrendingNow = (props: Props) => {
	const [ref] = useKeenSlider<HTMLDivElement>({
		slides: {
			perView: 2,
			spacing: 15
		}
	})

	return (
		<div>
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
