import React from 'react'
import Testimonial from '../testimonial'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import classNames from 'classnames'

const Testimonials = () => {
	const [sliderRef] = useKeenSlider<HTMLDivElement>(
		{
			loop: true
		},
		[
			slider => {
				let timeout: ReturnType<typeof setTimeout>
				let mouseOver = false
				function clearNextTimeout() {
					clearTimeout(timeout)
				}
				function nextTimeout() {
					clearTimeout(timeout)
					if (mouseOver) return
					timeout = setTimeout(() => {
						slider.next()
					}, 2000)
				}
				slider.on('created', () => {
					slider.container.addEventListener('mouseover', () => {
						mouseOver = true
						clearNextTimeout()
					})
					slider.container.addEventListener('mouseout', () => {
						mouseOver = false
						nextTimeout()
					})
					nextTimeout()
				})
				slider.on('dragStarted', clearNextTimeout)
				slider.on('animationEnded', nextTimeout)
				slider.on('updated', nextTimeout)
			}
		]
	)

	return (
		<div>
			<div className="keen-slider" ref={sliderRef}>
				<Testimonial className="keen-slider__slide" />
				<Testimonial className="keen-slider__slide" />
				<Testimonial className="keen-slider__slide" />
				<Testimonial className="keen-slider__slide" />
				<Testimonial className="keen-slider__slide" />
				<Testimonial className="keen-slider__slide" />
			</div>
		</div>
	)
}

export default Testimonials
