import React, { FC } from 'react'
import styles from './styles.module.scss'
import { useLockBodyScroll } from '@uidotdev/usehooks'
import { IoCloseCircle } from 'react-icons/io5'

const ShippingModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	useLockBodyScroll()

	return (
		<div className="relative">
			<div className={styles.BG} />
			<div className={styles.mainWrapper}>
				<IoCloseCircle onClick={closeModal} color="black" className="absolute top-[9rem] z-[9999]" />
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum nesciunt qui, sunt quis odit incidunt consectetur
				nulla omnis aut rem mollitia quaerat voluptatum nobis excepturi deleniti voluptatibus, debitis praesentium
				soluta quibusdam sapiente libero, laborum tempora distinctio. Asperiores nobis quasi iure debitis tenetur. Sequi
				odio eaque ipsam, dolorum provident blanditiis distinctio omnis quia commodi labore dignissimos totam. Fuga
				facere ullam quas eum quia repellendus necessitatibus, accusantium quo deserunt minima tempora, dolore
				asperiores. Vitae saepe cum veniam eos labore voluptatem amet modi illo blanditiis nemo! Architecto, reiciendis
				quasi pariatur rem itaque non provident cupiditate modi facilis nisi at? Repellendus itaque exercitationem non!
			</div>
		</div>
	)
}

export default ShippingModal
