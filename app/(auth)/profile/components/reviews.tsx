import Review from '@/components/profile/reviews'
import { Reviews as TReviews } from '@prisma/client'
import React, { FC } from 'react'

type Props = {
  data: TReviews[]
}

const Reviews: FC<Props> = ({ data }) => {
  return (
    <div>
      {data?.map(review => (
        <Review data={review} />
      ))}
    </div>
  )
}

export default Reviews
