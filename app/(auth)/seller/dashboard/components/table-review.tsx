import { TReviewResponse } from '@/constants/types'
import { dateFormatter } from '@/utils/helpers'
import { Avatar, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { Rate } from 'antd'
import React, { FC } from 'react'

const ReviewsSection: FC<{ reviews: TReviewResponse[] }> = ({ reviews }) => {
	return (
		<Card>
			<CardHeader>Recent Reviews</CardHeader>
			<CardBody className="gap-4">
				{reviews.map((review, index) => (
					<React.Fragment key={review.id}>
						<div className="flex gap-4">
							<Avatar src={`${review.user.image}`} size="sm" />
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{review.user.firstName} {review.user.lastName}
									</span>
									<Rate value={review.rating} disabled allowHalf allowClear />
								</div>
								<p className="text-small text-default-500">{review.product.name}</p>
								<p className="mt-1">{review.comment}</p>
								<p className="text-tiny text-default-400 mt-1">{dateFormatter(review.createdAt)}</p>
							</div>
						</div>
						{index < reviews.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</CardBody>
		</Card>
	)
}

export default ReviewsSection
