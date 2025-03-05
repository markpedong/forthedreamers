import React, { FC } from 'react'
import { Card, CardBody, Button, Chip } from '@heroui/react'

type Props = {
  order: Order
}

interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled'
  items: number
}

const Orders: FC<Props> = ({ order }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'success'
      case 'processing':
        return 'primary'
      case 'shipped':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: Order['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <Card key={order.id} className="w-full">
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-small text-default-500">{order.date}</p>
            </div>
            <Chip color={getStatusColor(order.status) as any} variant="flat" size="sm">
              {getStatusText(order.status)}
            </Chip>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-small">{order.items} items</p>
              <span className="text-small text-default-500">•</span>
              <p className="font-medium">${order.total.toFixed(2)}</p>
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
