import { TReviewResponse } from '@/constants/types'
import { dateFormatter } from '@/utils/helpers'
import { Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { Rate } from 'antd'
import Image from 'next/image'
import React, { FC } from 'react'

const ReviewsSection: FC<{ reviews: TReviewResponse[] }> = ({ reviews }) => {
	return (
		<Card>
			<CardHeader>Recent Reviews</CardHeader>
			<CardBody className="gap-4">
				{reviews.map((review, index) => (
					<div key={review.id}>
						<div className="flex gap-4">
							{review.user.image && (
								<Image src={review.user.image || ''} alt="" width={50} height={50} className="size-10 rounded-full" />
							)}
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold">
										{review.user.firstName} {review.user.lastName}
									</span>
									<Rate value={review.rating} disabled allowHalf allowClear />
								</div>
								<a className="text-small text-default-500" href={`/products/${review.product.id}`} target="_blank">
									{review.product.name}
								</a>
								<p className="mt-1">{review.comment}</p>
								<p className="text-tiny text-default-400 mt-1">{dateFormatter(review.createdAt)}</p>
							</div>
						</div>
						{index < reviews.length - 1 && <Divider />}
					</div>
				))}
			</CardBody>
		</Card>
	)
}

export default ReviewsSection
