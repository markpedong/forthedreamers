import { TReviewItem } from '@/constants/types'
import React, { FC, useState } from 'react'
import { Card, CardBody, CardHeader, Avatar, Divider, Pagination } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Rate } from 'antd'
import { calculateAverageRating, dateFormatter } from '@/utils/helpers'

const ProductReviews: FC<{ reviews: TReviewItem[] }> = ({ reviews }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const reviewsPerPage = 3

	const indexOfLastReview = currentPage * reviewsPerPage
	const indexOfFirstReview = indexOfLastReview - reviewsPerPage
	const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

	const totalPages = Math.ceil(reviews.length / reviewsPerPage)

	return (
		<Card>
			<CardHeader className="flex flex-col gap-1">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-semibold">Customer Reviews</h3>
					<div className="flex items-center gap-2">
						<div className="flex">
							{[...Array(5)].map((_, i) => (
								<Icon
									key={i}
									icon={i < 4 ? 'lucide:star-filled' : 'lucide:star'}
									className={i < 4 ? 'text-warning' : 'text-default-300'}
								/>
							))}
						</div>
						<span className="text-sm font-medium">{calculateAverageRating(reviews)}</span>
						<span className="text-xs text-default-500">({reviews.length} reviews)</span>
					</div>
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-4">
				{currentReviews.map((review, index) => (
					<React.Fragment key={review.id}>
						{index > 0 && <Divider />}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar src={review.user.image} size="sm" />
									<span className="font-medium">
										{review.user.firstName} {review.user.lastName}
									</span>
								</div>
								<span className="text-xs text-default-500">{dateFormatter(review.createdAt, 'monthDayYear')}</span>
							</div>
							<div className="flex items-center gap-2">
								{<Rate value={review.rating} allowHalf disabled />}
								<span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
							</div>
							<p className="text-sm text-default-700">{review.comment}</p>
						</div>
					</React.Fragment>
				))}

				{reviews.length > reviewsPerPage && (
					<div className="flex justify-center mt-4">
						<Pagination total={totalPages} initialPage={1} page={currentPage} onChange={setCurrentPage} />
					</div>
				)}
			</CardBody>
		</Card>
	)
}

export default ProductReviews
