import { TReviewItem } from '@/constants/types'
import { dateFormatter } from '@/utils/helpers'
import { Card, CardBody, Divider, Link } from '@heroui/react'
import { Rate } from 'antd'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
	data: TReviewItem
}

const Review: FC<Props> = ({ data }) => {
	const { push } = useRouter()

	return (
		<Card key={data.id} className="w-full">
			<CardBody>
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<Link className="font-medium" href={`/products/${data.productId}`} target="_blank">
							{data.product.name}
						</Link>
						<p className="text-small text-default-500">{dateFormatter(data.createdAt)}</p>
					</div>
					<div className="flex items-center gap-2">
						<Rate value={data.rating} />
						<span className="text-small text-default-500">{data.rating}/5</span>
					</div>
					<Divider className="my-1" />
					<p className="text-small">{data.comment}</p>
				</div>
			</CardBody>
		</Card>
	)
}

export default Review
