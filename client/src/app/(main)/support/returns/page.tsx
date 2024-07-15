import { ListAnswers, PageTitle, Question } from '@/components/page-components'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import styles from './styles.module.scss'
import { CANCEL_ANSWERS, RETURN_ANSWERS, RETURN_POLICY, WRONGITEM_ANSWERS } from '@/app/(main)/constants'

const roboto = Roboto_Condensed({ weight: ['400', '600', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<PageTitle title="returns" />
			<Question question="WHAT IS FOR THE DREAMERS RETURN POLICY?" />
			<ListAnswers answers={RETURN_POLICY} />
			<div className="py-5" />
			<Question question="I WANT TO RETURN MY ITEM FOR AN EXCHANGE/REFUND." />
			<ListAnswers answers={CANCEL_ANSWERS} />
			<div className="py-5" />
			<Question question="I NEED TO RETURN A FAULTY ITEM." />
			<ListAnswers answers={RETURN_ANSWERS} />
			<Question question="I RECEIVED THE WRONG ITEM." />
			<ListAnswers answers={WRONGITEM_ANSWERS} />
		</div>
	)
}

export default Page
