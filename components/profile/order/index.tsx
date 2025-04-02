import { dateFormatter } from '@/utils/helpers'
import { Button, Card, Chip, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { STATUS, Orders as TOrders } from '@prisma/client'
import { FC } from 'react'

type Props = {
	order: TOrders
}

const statusColorMap = {
	[STATUS.PENDING]: 'warning',
	[STATUS.PROCESSING]: 'primary',
	[STATUS.SHIPPED]: 'secondary',
	[STATUS.DELIVERED]: 'success',
	[STATUS.CANCELED]: 'danger'
} as const

const Orders: FC<Props> = ({ order }) => {
	return (
		<div className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-neutral-900  rounded-lg sm:items-center justify-between">
			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">Order #{order.id}</span>
				<span className="text-xs text-default-500">{dateFormatter(order.createdAt)}</span>
				<div className="flex items-center gap-2">
					<Chip size="sm" color={statusColorMap[order.status]} variant="flat">
						{order.status}
					</Chip>
					<span className="text-xs text-default-500">
						{order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
					</span>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
				<span className="font-medium">${order.total?.toFixed(2)}</span>
				<Button
					size="sm"
					variant="faded"
					color="primary"
					onPress={() => console.log("View order", order)}
					endContent={<Icon icon="lucide:arrow-right" />}
				>
					View Details
				</Button>
			</div>

			<Divider className="sm:hidden" />
		</div>
	)
}

export default Orders
