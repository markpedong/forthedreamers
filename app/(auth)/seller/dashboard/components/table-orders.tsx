import React, { FC } from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Button } from '@heroui/react'
import { Orders, STATUS } from '@prisma/client'

const statusColorMap = {
	[STATUS.PENDING]: 'warning',
	[STATUS.PROCESSING]: 'primary',
	[STATUS.SHIPPED]: 'secondary',
	[STATUS.DELIVERED]: 'success',
	[STATUS.CANCELED]: 'danger'
} as const

const TableOrders: FC<{ orders: Orders[] }> = ({ orders }) => {
	return (
		<Table aria-label="Orders table"> 
			<TableHeader>
				<TableColumn>ORDER ID</TableColumn>
				<TableColumn>CUSTOMER</TableColumn>
				<TableColumn>PRODUCT</TableColumn>
				<TableColumn>AMOUNT</TableColumn>
				<TableColumn>STATUS</TableColumn>
				<TableColumn>DATE</TableColumn>
				<TableColumn>ACTIONS</TableColumn>
			</TableHeader>
			<TableBody emptyContent={"No rows to display."}>
				{orders.map(order => (
					<TableRow key={order.id}>
						<TableCell>#{order.id}</TableCell>
						<TableCell>{'order.customer'}</TableCell>
						<TableCell>{'order.product'}</TableCell>
						<TableCell>${'order.amount.toFixed(2)'}</TableCell>
						<TableCell>
							<Chip color={statusColorMap[order.status]} size="sm" variant="flat">
								{order.status}
							</Chip>
						</TableCell>
						<TableCell>{order.date}</TableCell>
						<TableCell>
							<Button size="sm" variant="bordered" onPress={() => console.log('View order', order.id)}>
								View Details
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default TableOrders
