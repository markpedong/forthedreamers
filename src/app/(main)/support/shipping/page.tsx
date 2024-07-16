import React from 'react'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import classNames from 'classnames'
import { ListAnswers, PageTitle, Question } from '@/components/page-components'
import { SAMEDAY_ANSWERS, SHIPPING_ANSWERS } from '@/app/(main)/constants'

const roboto = Roboto_Condensed({ weight: ['400', '600', '800'], subsets: ['latin'] })

const Page = () => {
	return (
		<div className={classNames(styles.mainWrapper, roboto.className)}>
			<PageTitle title="SHIPPING" />
			<Question question="WHAT PAYMENT METHODS DO YOU ACCEPT?" />
			<Question question="STANDARD" />
			<ListAnswers answers={SHIPPING_ANSWERS} />
			<Question question="SAME DAY DELIVERY" className="mt-10" />
			<Question
				normal
				question="Please note that this is not free. While this option appears as such at checkout, you are still responsible for
				arranging and paying for the courier service of your choice. It is listed as free because courier rates can
				vary."
				className="text-[0.8rem]"
			/>
			<ListAnswers answers={SAMEDAY_ANSWERS} />
			<Question question="HOW LONG WILL IT TAKE TO RECEIVE MY ORDER?" className="mt-10" />
			<table>
				<tbody>
					<tr>
						<td>Standard</td>
						<td>
							Metro Manila: Within 3-5 business days <br /> Provincial: Please check J&T's shipping
							timeframe chart.
						</td>
					</tr>
					<tr>
						<td>Same Day Delivery </td>
						<td>Courier pick ups may be arranged between 1:30pm to 6pm, Mon-Sat</td>
					</tr>
					<tr>
						<td>Self Pick-up </td>
						<td>You may visit our HQ between 1:30pm to 6pm, Mon-Sat</td>
					</tr>
				</tbody>
			</table>
			<Question question="DO YOU SHIP INTERNATIONALLY?" className="mt-10" />
			<Question
				normal
				renderJSX={() => (
					<>
						Yes we do! You may place an order thru this <span className="underline">form</span>. Please note
						that shipping rates are subject to change as additional charges may apply. We accept payments
						via GCash, Bank Transfer, Sendwave, Wise and Remitly. You may send your proof of payment via
						Instagram or Email. Feel free to send us a message on Instagram at{' '}
						<span className="underline">@forthedreamers</span> if you have questions.
					</>
				)}
				className="text-[0.8rem]"
			/>
			<div className="text-[0.8rem]"></div>
			<Question question="MY ITEM IS MISSING." className="mt-10" />
			<div className="text-[0.8rem]">
				For substantial orders, we typically divide the items into two or more parcels. As a result, your items
				may be shipped with multiple tracking numbers. This means you will receive separate parcels, possibly at
				different times and dates. If this isn't the case, please contact our Support team on Instagram.
			</div>
		</div>
	)
}

export default Page
