'use client'

import Orders from '@/components/profile/order'
import { TOrderItems } from '@/constants/types'
import { getOrders } from '@/lib/server'
import { Pagination } from '@heroui/react'
import { Orders as TOrders } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { FC, useEffect, useState } from 'react'

type Props = {}

const OrderList: FC<Props> = () => {
  const ordersPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<TOrderItems[]>([])
  const totalPages = Math.ceil(data.length / ordersPerPage)
  const currentOrders = data.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOrders(`${session?.user?.id}`)

      setData(response.data)
    }
    fetchData()
  }, [])

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
