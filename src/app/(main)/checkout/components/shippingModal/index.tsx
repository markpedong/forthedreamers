import React, { FC } from 'react'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { IoCloseCircle } from 'react-icons/io5'
import { ListAnswers, Question } from '@/components/page-components'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { SHIPPING_ANSWERS, SHIPPING_MODAL } from '@/app/(main)/constants'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const ShippingModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	useLockBodyScroll()

	return (
		<>
			<div className={styles.BG} />
			<div className={styles.mainWrapper}>
				<IoCloseCircle
					onClick={closeModal}
					color="black"
					className="absolute top-4 right-4 z-[9999]"
					size={30}
				/>
				<Question question="Shipping Policy" className={classNames(roboto.className, styles.header)} />
				<div>
					<Question normal question="WHAT SHIPPING TYPES DO YOU HAVE?" />
					<ListAnswers
						className="!mt-0"
						answers={SHIPPING_ANSWERS?.map(q => `For ${q}`).concat(SHIPPING_MODAL)}
					/>
					<Question normal question="HOW LONG WILL IT TAKE TO RECEIVE MY ORDER?" />
					<ListAnswers
						className="!mt-0"
						answers={[
							`Metro Manila: Within 3-5 business days`,
							`Provincial: Please check J&T's shipping <a class="text-blue-600" href="https://www.jtexpress.ph/trajectoryQuery?flag=3" target="_blank">timeframe chart</a>.`
						]}
					/>
					<Question normal question="DO YOU SHIP INTERNATIONALLY?" />
					<ListAnswers
						className="!mt-0"
						answers={[
							`Yes we do! You may place an order thru this form and send us a message on Instagram at @forthedreamers if you have questions.`
						]}
					/>
				</div>
			</div>
		</>
	)
}

export default ShippingModal
