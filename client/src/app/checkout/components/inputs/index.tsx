import React from 'react'
import styles from './styles.module.scss'
import { Question } from '@/components/page-components'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { FaQuestionCircle } from 'react-icons/fa'

const Inputs = () => {
	return (
		<>
			<div className={styles.email}>
				<input type="text" placeholder="Email" className={styles.email__input} />
				<div className={styles.email__checkbox}>
					<input type="checkbox" id="check3" /> Email me with news and offers
					<label htmlFor="check3">
						<span className="fa fa-check" />
					</label>
				</div>
			</div>
			<div className={styles.delivery}>
				<Question question="Delivery" />
				<div className={styles.delivery__selectContainer}>
					<label>Country</label>
					<select name="country">
						<option value="">---</option>
						<option value="Philippines">Philippines</option>
					</select>
				</div>
			</div>
			<div className={styles.twoInputs}>
				<input type="text" placeholder="First Name" />
				<input type="text" placeholder="Last Name" />
			</div>
			<input
				type="text"
				className={styles.address}
				placeholder="Address (Please do not forget to include your Barangay)"
			/>
			<input type="text" className={styles.apartment} placeholder="Apartment, suite, etc. (optional)" />
			<div className={styles.twoInputs}>
				<input type="text" placeholder="Postal Code" />
				<input type="text" placeholder="City" />
			</div>
			<div className={styles.region}>
				<label>Region</label>
				<select name="country">
					<option value="">---</option>
					<option value="abra">Abra</option>
				</select>
			</div>
			<div className={styles.phone}>
				<input type="text" placeholder="Phone" />
				<Tooltip anchorSelect=".my-anchor-element" place="top">
					In case we need to contact you about your order
				</Tooltip>
				<FaQuestionCircle className="my-anchor-element" />
			</div>
		</>
	)
}

export default Inputs
