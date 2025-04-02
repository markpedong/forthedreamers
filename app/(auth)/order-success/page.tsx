import React from 'react'
import OrderSuccess from './components'
import { getCookie } from '@/lib/server'
import { unauthorized } from 'next/navigation'

const Page = async () => {
	const orderID = await getCookie('orderID')

	if (!orderID) {
		unauthorized()
	}

	return <OrderSuccess orderId={orderID} />
}

export default Page
