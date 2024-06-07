import React from 'react'
import styles from './styles.module.scss'
import Testimonial from '../testimonial'
import { Carousel } from 'antd'

const Testimonials = () => {
	return (
		<div>
			<Carousel className={styles.testimonialsWrapper} autoplay infinite arrows autoplaySpeed={2000}>
				<Testimonial />
				<Testimonial />
				<Testimonial />
				<Testimonial />
				<Testimonial />
				<Testimonial />
			</Carousel>
		</div>
	)
}

export default Testimonials
