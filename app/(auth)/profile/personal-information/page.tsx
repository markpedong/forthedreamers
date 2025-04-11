import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getUserData } from '@/utils/request'
import { getServerSession } from 'next-auth'
import React from 'react'
import PersonalInformation from '.'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const data = (await getUserData(`${session?.user.id}`)).data

  return <PersonalInformation userInfo={data} />
}

export default Page
