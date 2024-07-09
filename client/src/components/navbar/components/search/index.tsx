import Drawer from '@/components/drawer'
import classNames from 'classnames'
import React, { FC, useState } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'
import styles from './styles.module.scss'
import { Roboto_Condensed } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { Question } from '@/components/page-components'
import Image from 'next/image'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const SearchProduct: FC = () => {
	return (
		<div className={styles.products__item}>
			<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
			<div className={classNames(styles.products__textContainer, roboto.className)}>
				<span>DOG PRODUCT TITLE</span>
				<span>₱9999.00</span>
			</div>
		</div>
	)
}
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
					<div className="fcol justify-between">
						<div>
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
							<div className={styles.products}>
								<SearchProduct />
								<SearchProduct />
								<SearchProduct />
								<SearchProduct />
							</div>
						</div>
						<motion.span whileTap={{ scale: 0.97 }} className={classNames(styles.footer, roboto.className)}>
							view all results
						</motion.span>
					</div>
				)}
			</AnimatePresence>
		</Drawer>
	)
}

export default Search
