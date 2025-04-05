import { statusColorMap } from '@/constants'
import { TOrdersResponse } from '@/constants/types'
import { dateFormatter } from '@/utils/helpers'
import {
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure
} from '@heroui/react'
import React, { FC } from 'react'
import OrderDetailsModal from './table-orders-modal'

const TableOrders: FC<{ orders: TOrdersResponse[] }> = ({ orders }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = React.useState<TOrdersResponse | null>(null);

	const handleViewDetails = (order: TOrdersResponse) => {
		setSelectedOrder(order)
		onOpen()
	}

	return (
		<>
			<Table aria-label="Orders table">
				<TableHeader>
					<TableColumn>ORDER ID</TableColumn>
					<TableColumn className="text-center">CUSTOMER</TableColumn>
					<TableColumn>AMOUNT</TableColumn>
					<TableColumn>STATUS</TableColumn>
					<TableColumn>DATE</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>
				<TableBody emptyContent={'No rows to display.'}>
					{orders.map(order => (
						<TableRow key={order.id}>
							<TableCell>#{order.id}</TableCell>
							<TableCell className="text-center">
								{order.user.firstName} {order.user.lastName}
							</TableCell>
							<TableCell>${order.total!.toFixed(2)}</TableCell>
							<TableCell>
								<Chip color={statusColorMap[order.status]} size="sm" variant="flat">
									{order.status}
								</Chip>
							</TableCell>
							<TableCell>{dateFormatter(order.createdAt)}</TableCell>
							<TableCell>
								<Button size="sm" variant="bordered" onPress={() => handleViewDetails(order)}>
									View Details
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{selectedOrder && <OrderDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />}
		</>
	)
}

export default TableOrders
