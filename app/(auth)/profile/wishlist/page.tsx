import authOptions from '@/app/api/auth/[...nextauth]/options'
import WishListComp from '@/components/profile/wishlist'
import { getWishlist } from '@/lib/server'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const data = (await getWishlist(`${session?.user.id}`)).data

  return data?.map(item => <WishListComp key={item.id} item={item} />)
}

export default Page
