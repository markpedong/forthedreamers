import { Orders } from '@prisma/client'
import React, { FC } from 'react'

type Props = {
	orders: Orders[]
}

const TableOrders: FC<Props> = (props) => {
	return <div>TableOrders</div>
}

export default TableOrders
