import React, { Dispatch, FC } from 'react'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { statusColorMap } from '@/constants'
import { Orders, STATUS } from '@prisma/client'
import { dateFormatter } from '@/utils/helpers'
import { TOrderItems } from '@/constants/types'

type Props = {
  selectedOrder: TOrderItems | null
  setSelectedOrder: Dispatch<React.SetStateAction<TOrderItems | null>>
}

const OrderDetails: FC<Props> = ({ setSelectedOrder, selectedOrder }) => {
  return (
    <Modal isOpen={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)} size="2xl">
      <ModalContent>
        {onClose =>
          selectedOrder && (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h3>Order Details</h3>
                  <span className="text-sm text-default-500">Order ID: {selectedOrder.id}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Order Status</span>
                    <div className="flex items-center gap-4">
                      <Chip color={statusColorMap[selectedOrder.status]} variant="flat">
                        {selectedOrder.status}
                      </Chip>
                      <span className="text-sm text-default-500">{dateFormatter(selectedOrder.createdAt)}</span>
                    </div>
                  </div>

                  <Divider />

                  {/* Order Items */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Order Items</span>
                    <Table removeWrapper aria-label="Order items">
                      <TableHeader>
                        <TableColumn>PRODUCT</TableColumn>
                        <TableColumn className="text-center">QUANTITY</TableColumn>
                        <TableColumn className="text-center">PRICE</TableColumn>
                        <TableColumn className="text-center">TOTAL</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.orderItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                                <span className="text-sm">{item.product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-center">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Divider />
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Order Summary</span>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-default-500">Subtotal</span>
                        {/* 10 is shipping */}
                        <span className="text-sm">${selectedOrder.total!.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-default-500">Shipping</span>
                        <span className="text-sm">$10.00</span>
                      </div>
                      <Divider className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">${(selectedOrder.total! + 10).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                {selectedOrder.status === STATUS.DELIVERED && (
                  <Button color="primary" variant="faded" startContent={<Icon icon="lucide:star" />}>
                    Write a Review
                  </Button>
                )}
              </ModalFooter>
            </>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default OrderDetails
