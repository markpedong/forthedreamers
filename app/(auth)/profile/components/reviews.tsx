import Review from '@/components/profile/reviews'
import { getReviews } from '@/lib/server'
import { Spinner } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const Reviews: FC = () => {
	const { data: session } = useSession()
	const { data = [], isPending } = useQuery({
		queryKey: ['reviews', session?.user?.id],
		queryFn: async () => {
			const response = await getReviews(`${session?.user?.id}`)

			return response.data
		}
	})

	return (
		<div className="flex items-center justify-center flex-col gap-5">
			{isPending && <Spinner />}
			{data?.map(review => (
				<Review data={review} key={review.id} />
			))}
		</div>
	)
}

export default Reviews
