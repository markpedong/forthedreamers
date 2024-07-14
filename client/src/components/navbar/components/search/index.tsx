import Drawer from '@/components/drawer'
import classNames from 'classnames'
import React, { FC, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { Question } from '@/components/page-components'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import SearchProduct from '../../products'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const Search: FC<{ setSearch: () => void }> = ({ setSearch }) => {
	const [value, setValue] = useState('')
	const sample = ['hoodie', 'hoodies', 'casual', 'apparel']

	useLockBodyScroll()
	return (
		<Drawer>
			<div className="fcol h-full">
				<div className={classNames(styles.header, roboto.className)}>
					<input placeholder="Search for anything" value={value} onChange={e => setValue(e.target.value)} />
					<IoIosCloseCircle onClick={setSearch} color="black" />
				</div>
				<AnimatePresence>
					{sample.some(word => !!value && word.includes(value)) && (
						<>
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
							<Question normal question="PRODUCTS" className={styles.productHeader} />
							<motion.div
								className={styles.products}
								initial={{ y: 100, opacity: 0 }}
								exit={{ y: 100, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
							>
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
								<SearchProduct isCart={false} />
							</motion.div>
							<motion.div whileTap={{ scale: 0.97 }} className={classNames(styles.footer, roboto.className)}>
								view all results
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</Drawer>
	)
}

export default Search
