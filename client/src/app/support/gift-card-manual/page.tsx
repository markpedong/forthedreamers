import React from 'react'
import styles from './styles.module.scss'
import { ListAnswers, PageTitle, Question } from '@/components/page-components'
import { TERMS_CONDITIONS } from '@/app/constants'

const Page = () => {
	return (
		<div className={styles.mainWrapper}>
			<PageTitle title="GIFT CARD MANUAL" />
			<Question question="TERMS AND CONDITIONS" />
			<ListAnswers answers={TERMS_CONDITIONS} />
			<div className="mt-10" />
			<Question question="FAQ'S" />
		</div>
	)
}

export default Page
