import Review from '@/components/profile/reviews'
import { TReviewItem } from '@/constants/types'
import { FC } from 'react'

const Reviews: FC<{ data: TReviewItem[] }> = ({ data }) => {
	return (
		<div className="flex items-center justify-center flex-col gap-5">
			{data?.map(review => (
				<Review data={review} key={review.id} />
			))}
		</div>
	)
}

export default Reviews
