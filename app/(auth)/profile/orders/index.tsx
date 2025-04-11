'use client'

import Order from '@/components/profile/order'
import { TOrdersResponse } from '@/constants/types'
import { Pagination } from '@heroui/react'
import { FC, useState } from 'react'

const Orders: FC<{ data: TOrdersResponse[] }> = ({ data }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const ordersPerPage = 5
	const totalPages = Math.ceil((data.length || 0) / ordersPerPage)
	const currentOrders = data?.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

	return (
		<div className="flex justify-center items-center">
			{currentOrders?.map(order => (
				<Order order={order} key={order.id} />
			))}
			{totalPages > 1 && (
				<div className="flex justify-center mt-6">
					<Pagination total={totalPages} initialPage={1} page={currentPage} onChange={setCurrentPage} />
				</div>
			)}
		</div>
	)
}

export default Orders
