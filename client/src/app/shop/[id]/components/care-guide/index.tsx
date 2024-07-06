import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { CARE_GUIDE } from '@/app/constants/enums'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const CareGuide: FC<{ setOpenCareGuide: () => void, activeTab: CARE_GUIDE }> = ({ setOpenCareGuide, activeTab }) => {
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
				<div className={styles.tabs}>
          <span>care guide</span>
          <span>shipping</span>
          <span>returns</span>
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
