import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'

type Props = {}

const roboto = Roboto_Condensed({ weight: ['500', '400', '600'], subsets: ['latin'] })

const Testimonial = (props: Props) => {
	return (
		<div className={classNames(styles.testimonialContainer, roboto.className)}>
			<h1>"Comfy, cool and aesthetically pleasing.."</h1>
			<span>- PREVIEW</span>
		</div>
	)
}

export default Testimonial
