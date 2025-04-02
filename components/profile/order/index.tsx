import React, { FC } from 'react'
import { Card, CardBody, Button, Chip } from '@heroui/react'
import { Orders as TOrders, STATUS } from '@prisma/client'
import { dateFormatter } from '@/utils/helpers'

type Props = {
	order: TOrders
}

const Orders: FC<Props> = ({ order }) => {
	const getStatusColor = (status: TOrders['status']) => {
		switch (status) {
			case STATUS.DELIVERED:
				return 'success'
			case STATUS.PROCESSING:
				return 'primary'
			case STATUS.SHIPPED:
				return 'warning'
			case STATUS.CANCELED:
				return 'danger'
			default:
				return 'default'
		}
	}

	const getStatusText = (status: TOrders['status']) => {
		return status.charAt(0).toUpperCase() + status.slice(1)
	}

	return (
		<Card key={order.id} className="w-full">
			<CardBody>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">{order.id}</p>
							<p className="text-small text-default-500">{dateFormatter(order.createdAt)}</p>
						</div>
						<Chip color={getStatusColor(order.status) as any} variant="flat" size="sm">
							{getStatusText(order.status)}
						</Chip>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<p className="text-small">{order.totalItems} items</p>
							<span className="text-small text-default-500">•</span>
							<p className="font-medium">${order.total?.toFixed(2)}</p>
						</div>
						<Button size="sm" variant="flat">
							View Details
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default Orders
