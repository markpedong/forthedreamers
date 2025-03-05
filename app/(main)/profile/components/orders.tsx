import Orders from '@/components/profile/order'
import { Orders as TOrders } from '@prisma/client'
import React, { FC } from 'react'

type Props = {
  data: TOrders[]
}

const OrderList: FC<Props> = ({ data }) => {
  return (
    <div>
      {data?.map(order => (
        <Orders order={order} />
      ))}
    </div>
  )
}

export default OrderList
