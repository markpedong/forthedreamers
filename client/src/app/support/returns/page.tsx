import React from 'react'
import styles from './styles.module.scss'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import Image from 'next/image'
import classNames from 'classnames'
import { PageTitle, Question } from '@/components/page-components'

const roboto = Roboto_Condensed({ weight: ['400', '600', '800'], subsets: ['latin'] })
const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<PageTitle title="returns" />
			<Question question={"WHAT IS CHARLOTTE FOLK'S RETURN POLICY?"} />
		</div>
	)
}

export default Page
