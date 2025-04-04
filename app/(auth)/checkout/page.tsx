import React from 'react'
import Checkout from './components'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getAddress, getPaymentMethod } from '@/lib/server'

const Page = async () => {
	const session = await getServerSession(authOptions)
	const address = await getAddress(`${session?.user?.id}`)
	const paymentMethods = await getPaymentMethod(`${session?.user?.id}`)

	return <Checkout addresses={address.data} paymentMethods={paymentMethods.data} />
}

export default Page
