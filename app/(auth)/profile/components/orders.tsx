'use client'

import Orders from '@/components/profile/order'
import { TOrderItems } from '@/constants/types'
import { Pagination } from '@heroui/react'
import { Orders as TOrders } from '@prisma/client'
import React, { FC, useState } from 'react'

type Props = {
  data: TOrderItems[]
}

const OrderList: FC<Props> = ({ data }) => {
  const ordersPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / ordersPerPage)
  const currentOrders = data.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  return (
    <div>
      {currentOrders?.map(order => (
        <Orders order={order} key={order.id} />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination total={totalPages} initialPage={1} page={currentPage} onChange={setCurrentPage} />
        </div>
      )}
    </div>
  )
}

export default OrderList
