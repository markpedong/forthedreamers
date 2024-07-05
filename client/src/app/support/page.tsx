'use client'

import { PageTitle, Question } from '@/components/page-components'
import { useRouter } from 'next/navigation'
import styles from './styles.module.scss'

const Page = () => {
	const { push } = useRouter()

	return (
		<div className={styles.mainWrapper}>
			<PageTitle title="SUPPORT" />
			<div className={styles.supportWrapper}>
				<span onClick={() => push('/support/orders-payment')}>ORDERS & PAYMENT</span>
				<span onClick={() => push('/support/shipping')}>SHIPPING</span>
				<span onClick={() => push('/support/returns')}>RETURNS</span>
				<span onClick={() => push('/support/gift-card-manual')}>GIFT CARD MANUAL</span>
			</div>
			<Question
				normal
				question={`We aim to ensure that our website content is user-friendly for everyone. If you encounter any difficulties
				accessing or navigating our site, please send us a message on Instagram
				<span className="font-[800]">@forthedreamers</span>`}
			/>
		</div>
	)
}

export default Page
