import React, { FC, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { CARE_GUIDE } from '@/app/(main)/constants/enums'
import { ListAnswers } from '@/components/page-components'
import { CARE_GUIDE_ANSWERS } from '@/app/(main)/constants'
import Shipping from '../shipping'
import Returns from '../returns'
import Drawer from '@/components/drawer'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const CareGuide: FC<{ setOpenCareGuide: () => void; activeTab: string }> = ({ setOpenCareGuide, activeTab }) => {
	const [selectedTab, setSelectedTab] = useState(activeTab)
	const tabs = ['care guide', 'shipping', 'returns']

	useLockBodyScroll()

	return (
		<Drawer>
			<div className={classNames(styles.header, roboto.className)}>
				<span>PRODUCT INFORMATION</span>
				<IoIosCloseCircle onClick={setOpenCareGuide} />
			</div>
			<div className={classNames(styles.tabs, roboto.className)}>
				{tabs?.map(q => (
					<span key={q} onClick={() => setSelectedTab(q)} data-isActive={q === selectedTab}>
						{q}
					</span>
				))}
			</div>
			<div className={styles.content}>
				{selectedTab === CARE_GUIDE.CARE_GUIDE && <ListAnswers answers={CARE_GUIDE_ANSWERS} />}
				{selectedTab === CARE_GUIDE.SHIPPING && <Shipping />}
				{selectedTab === CARE_GUIDE.RETURNS && <Returns />}
			</div>
		</Drawer>
	)
}

export default CareGuide
