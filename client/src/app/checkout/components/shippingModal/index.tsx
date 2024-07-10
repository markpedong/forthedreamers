import React, { FC } from 'react'
import styles from './styles.module.scss'

const ShippingModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	return (
		<div className={styles.mainWrapper}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum nesciunt qui, sunt quis odit incidunt consectetur
			nulla omnis aut rem mollitia quaerat voluptatum nobis excepturi deleniti voluptatibus, debitis praesentium soluta
			quibusdam sapiente libero, laborum tempora distinctio. Asperiores nobis quasi iure debitis tenetur. Sequi odio
			eaque ipsam, dolorum provident blanditiis distinctio omnis quia commodi labore dignissimos totam. Fuga facere
			ullam quas eum quia repellendus necessitatibus, accusantium quo deserunt minima tempora, dolore asperiores. Vitae
			saepe cum veniam eos labore voluptatem amet modi illo blanditiis nemo! Architecto, reiciendis quasi pariatur rem
			itaque non provident cupiditate modi facilis nisi at? Repellendus itaque exercitationem non!
		</div>
	)
}

export default ShippingModal
