import React from 'react'
import PaymentMethods from '.'
import { getPaymentMethod } from '@/lib/server'
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const paymentMethods = (await getPaymentMethod(`${session?.user.id}`)).data

  return <PaymentMethods data={paymentMethods} />
}

export default Page
