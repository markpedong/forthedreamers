import Drawer from '@/components/drawer'
import classNames from 'classnames'
import React, { FC } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Search: FC<{ setSearch: () => void }> = ({ setSearch }) => {
	return (
		<Drawer>
			<div className={classNames(styles.header, roboto.className)}>
				<input placeholder="SEARCH" />
				<IoIosCloseCircle onClick={setSearch} color='black'/>
			</div>
		</Drawer>
	)
}

export default Search
