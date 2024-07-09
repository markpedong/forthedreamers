import Drawer from '@/components/drawer'
import classNames from 'classnames'
import React, { FC, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'

const roboto = Roboto_Condensed({ weight: ['300', '800'], subsets: ['latin'] })

const Search: FC<{ setSearch: () => void }> = ({ setSearch }) => {
	const [value, setValue] = useState('')
	const sample = ['hoodie', 'hoodies', 'casual', 'apparel']

	return (
		<Drawer>
			<div className={classNames(styles.header, roboto.className)}>
				<input placeholder="Search for anything" value={value} onChange={e => setValue(e.target.value)} />
				<IoIosCloseCircle onClick={setSearch} color="black" />
			</div>
			<AnimatePresence>
				{sample.some(word => !!value && word.includes(value)) && (
					<div className={classNames(styles.suggestions, roboto.className)}>
						<motion.span
							className={styles.suggestions__header}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							SUGGESTIONS
						</motion.span>
						<motion.div
							className={styles.suggestions__container}
							initial={{ x: 100, opacity: 0 }}
							exit={{ x: 100, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
						>
							{sample?.map(q => (
								<span className={styles.suggestions__item}>{q}</span>
							))}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</Drawer>
	)
}

export default Search
