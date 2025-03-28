import React from 'react'
import Checkout from './components'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getAddress } from '@/utils/request'

type Props = {}

const Page = async () => {
	const session = await getServerSession(authOptions)
	const address = await getAddress(`${session?.user?.id}`)

	return <Checkout addresses={address.data} />
}

export default Page
