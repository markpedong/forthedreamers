import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getAddress } from '@/lib/server'
import { getServerSession } from 'next-auth'
import React from 'react'
import Addresses from '.'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const data = (await getAddress(`${session?.user.id}`)).data

  return <Addresses data={data} />
}

export default Page
