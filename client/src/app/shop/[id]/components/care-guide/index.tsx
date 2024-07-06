import React, { FC, useState } from 'react'
import { motion } from 'framer-motion'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { CARE_GUIDE } from '@/app/constants/enums'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const CareGuide: FC<{ setOpenCareGuide: () => void; activeTab: CARE_GUIDE }> = ({ setOpenCareGuide, activeTab }) => {
	const [selectedTab, setSelectedTab] = useState('care guide')
	const tabs = ['care guide', 'shipping', 'returns']

	useLockBodyScroll()

	return (
		<>
			<motion.div
				className={styles.careGuideWrapper}
				initial={{ x: 100, opacity: 0 }}
				exit={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1, transition: { duration: 0.1, ease: 'easeIn' } }}
			>
				<div className={classNames(styles.header, roboto.className)}>
					<span>PRODUCT INFORMATION</span>
					<IoIosCloseCircle onClick={setOpenCareGuide} />
				</div>
				<div className={classNames(styles.tabs, roboto.className)}>
					{tabs?.map(q => (
						<span onClick={() => setSelectedTab(q)} data-isActive={q === selectedTab}>
							{q}
						</span>
					))}
				</div>
			</motion.div>
			<motion.div
				className={styles.careGuideBG}
				initial={{ opacity: 0 }}
				exit={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.1, ease: 'easeIn' } }}
			/>
		</>
	)
}

export default CareGuide
