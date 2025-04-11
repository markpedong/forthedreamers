import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getOrders } from '@/lib/server'
import { getServerSession } from 'next-auth'
import React from 'react'
import Orders from '.'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const orders = (await getOrders(`${session?.user.id}`)).data

  return <Orders data={orders} />
}

export default Page
