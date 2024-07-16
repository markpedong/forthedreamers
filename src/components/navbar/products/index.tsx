import React, { FC, useState } from 'react'
import styles from './styles.module.scss'
import Image from 'next/image'
import classNames from 'classnames'
import { Roboto_Condensed } from 'next/font/google'
import { FaMinus, FaPlus, FaRegTrashAlt } from 'react-icons/fa'

const roboto = Roboto_Condensed({ weight: ['300', '400', '800'], subsets: ['latin'] })

const SearchProduct: FC<{ isCart?: boolean }> = ({ isCart }) => {
	const [quantity, setQuantity] = useState(1)

	return (
		<div className={styles.products__item} data-iscart={isCart}>
			<Image src={'/assets/images/dog.jpg'} alt="" height={100} width={100} />
			<div className={classNames(styles.products__textContainer, roboto.className)}>
				<div className={styles.products__titleContainer}>
					<span>DOG PRODUCT TITLE</span>
					<span>₱9999.00</span>
				</div>
				{isCart && (
					<>
						<div className={styles.products__variation}>medium</div>
						<div className={styles.quantityContainer}>
							<div className={styles.addMinusContainer}>
								<FaMinus onClick={() => setQuantity(qty => (qty > 1 ? qty - 1 : qty))} />
								<span className={styles.qty}>{quantity}</span>
								<FaPlus onClick={() => setQuantity(qty => (qty < 10 ? (qty += 1) : qty))} />
							</div>
							<FaRegTrashAlt color="red" />
						</div>
					</>
				)}
			</div>
		</div>
	)
}
export default SearchProduct
