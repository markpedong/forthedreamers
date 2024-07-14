import classNames from 'classnames'
import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import { FaArrowRight } from 'react-icons/fa'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

type Props = {}
const Pagination = (props: Props) => {
	return (
		<div className={classNames(styles.pagination, roboto.className)}>
			<span>1</span>
			<span>2</span>
			<span>3</span>
			<span>4</span>
			<span>
				<FaArrowRight />
			</span>
		</div>
	)
}

export default Pagination
