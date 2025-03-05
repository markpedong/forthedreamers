import { CardBody, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Reviews as TReview } from '@prisma/client'
import { Card } from 'antd'
import React, { FC } from 'react'

type Props = {
  data: TReview
}

const Review: FC<Props> = ({ data }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            icon="lucide:star"
            className={index < rating ? 'text-warning' : 'text-default-300'}
            width={16}
            height={16}
          />
        ))}
      </div>
    )
  }

  return (
    <Card key={data.id} className="w-full">
      <CardBody>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{(data as any).product.name}</p>
            <p className="text-small text-default-500">{data.createdAt?.toString()}</p>
          </div>
          <div className="flex items-center gap-2">
            {renderStars(data.rating)}
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
