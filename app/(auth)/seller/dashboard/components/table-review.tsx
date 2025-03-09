import React, { FC } from 'react'
import { Card, CardBody, CardHeader, Avatar, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Reviews } from '@prisma/client'

const ReviewsSection: FC<{ reviews: Reviews[] }> = ({ reviews }) => {
	return (
		<Card>
			<CardHeader>Recent Reviews</CardHeader>
			<CardBody className="gap-4">
				{reviews.map((review, index) => (
					<React.Fragment key={review.id}>
						<div className="flex gap-4">
							{/* <Avatar src={review.userImage} size="sm" /> */}
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="font-semibold">{'review.username'}</span>
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Icon
												key={i}
												icon="lucide:star"
												className={`w-4 h-4 ${i < review.rating ? 'text-warning' : 'text-default-300'}`}
											/>
										))}
									</div>
								</div>
								<p className="text-small text-default-500">{'review.productName'}</p>
								<p className="mt-1">{review.comment}</p>
								<p className="text-tiny text-default-400 mt-1">{review.createdAt?.toString()}</p>
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
