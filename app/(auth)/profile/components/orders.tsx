'use client'

import Orders from '@/components/profile/order'
import { TOrderItems } from '@/constants/types'
import { getOrders } from '@/lib/server'
import { Pagination, Spinner } from '@heroui/react'
import { Orders as TOrders } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React, { FC, useEffect, useState } from 'react'

type Props = {}

const OrderList: FC<Props> = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const { data: session } = useSession()
	const { data = [], isLoading } = useQuery<TOrderItems[]>({
		queryKey: ['orders', session?.user?.id],
		queryFn: async () => {
			const response = await getOrders(`${session?.user?.id}`)
			return response.data
		}
	})
	const ordersPerPage = 5
	const totalPages = Math.ceil((data.length || 0) / ordersPerPage)
	const currentOrders = data?.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

	return (
		<div className='flex justify-center items-center'>
			{isLoading && <Spinner />}
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
