import Review from '@/components/profile/reviews'
import { getReviews } from '@/lib/server'
import { Reviews as TReviews } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React, { FC } from 'react'

const Reviews: FC = () => {
	const { data: session } = useSession()
	const { data = [] } = useQuery({
		queryKey: ['reviews', session?.user?.id],
		queryFn: async () => {
			const response = await getReviews(`${session?.user?.id}`)

			return response.data
		}
	})

	return (
		<div>
			{data?.map(review => (
				<Review data={review} />
			))}
		</div>
	)
}

export default Reviews
