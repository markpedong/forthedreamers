import authOptions from '@/app/api/auth/[...nextauth]/options'
import Review from '@/components/profile/reviews'
import { getReviews } from '@/lib/server'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async () => {
  const session = await getServerSession(authOptions)
  const data = (await getReviews(`${session?.user.id}`)).data

  return (
    <div className="flex items-center justify-center flex-col gap-5">
      {data?.map(review => (
        <Review data={review} key={review.id} />
      ))}
    </div>
  )
}

export default Page
