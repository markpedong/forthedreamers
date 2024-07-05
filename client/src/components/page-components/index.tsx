import classNames from 'classnames'
import { Poppins, Roboto_Condensed } from 'next/font/google'
import React, { FC, ReactNode } from 'react'
import styles from './styles.module.scss'

const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })
const roboto = Roboto_Condensed({ weight: ['400', '800'], subsets: ['latin'] })

export const PageTitle: FC<{ title: string }> = ({ title }) => {
	return <div className={classNames(styles.pageTitle, poppins.className)}>{title}</div>
}

export const Question: FC<{ question: string; className?: string; normal?: boolean }> = ({
	question,
	className,
	normal
}) => {
	return (
		<div
			className={classNames(className, roboto.className, `font-${normal ? 'normal' : 'bold'}`, styles.question)}
			dangerouslySetInnerHTML={{ __html: question! }}
		/>
	)
}

export const ListAnswers: FC<{ answers: ReactNode[] }> = ({ answers }) => {
	return (
		<ul className={classNames(styles.answers, roboto.className)}>
			{answers?.map(q => (
				<li key={q?.toString()}>
					<div dangerouslySetInnerHTML={{ __html: q! }} />
				</li>
			))}
		</ul>
	)
}
