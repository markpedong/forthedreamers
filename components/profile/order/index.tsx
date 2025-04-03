import { statusColorMap } from '@/constants'
import { dateFormatter } from '@/utils/helpers'
import { Button, Card, Chip, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { STATUS, Orders as TOrders } from '@prisma/client'
import { FC, useState } from 'react'
import OrderDetails from '../order-details'
import { TOrderItems } from '@/constants/types'

type Props = {
  order: TOrderItems
}

const Orders: FC<Props> = ({ order }) => {
  const [selectedOrder, setSelectedOrder] = useState<TOrderItems | null>(null)
  
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-white dark:bg-neutral-800 shadow-medium rounded-lg sm:items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Order ID: {order.id}</span>
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
            variant="solid"
            color="primary"
            onPress={() => setSelectedOrder(order)}
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            View Details
          </Button>
        </div>

        <Divider className="sm:hidden" />
      </div>
      <OrderDetails selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
    </>
  )
}

export default Orders
