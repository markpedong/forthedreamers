import React, { FC } from 'react'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Card,
	CardBody,
	Divider
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { TOrdersResponse } from '@/constants/types'
import Address from '@/components/profile/address'

interface OrderDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	order: TOrdersResponse
}

const OrderDetailsModal: FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" scrollBehavior="inside">
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<h3>Order Details #{order.id}</h3>
							<p className="text-small text-default-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
						</ModalHeader>
						<ModalBody>
							<div className="space-y-6">
								{/* Order Summary */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Card>
										<CardBody>
											<div className="flex items-center gap-2">
												<Icon icon="lucide:package" className="w-5 h-5 text-primary" />
												<div>
													<p className="text-small text-default-500">Total Items</p>
													<p className="font-semibold">{order.totalItems}</p>
												</div>
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardBody>
											<div className="flex items-center gap-2">
												<Icon icon="lucide:dollar-sign" className="w-5 h-5 text-primary" />
												<div>
													<p className="text-small text-default-500">Total Amount</p>
													<p className="font-semibold">${order.total?.toFixed(2)}</p>
												</div>
											</div>
										</CardBody>
									</Card>
									<Card>
										<CardBody>
											<div className="flex items-center gap-2">
												<Icon icon="lucide:clock" className="w-5 h-5 text-primary" />
												<div>
													<p className="text-small text-default-500">Status</p>
													<Chip
														size="sm"
														variant="flat"
														color={
															order.status === 'DELIVERED'
																? 'success'
																: order.status === 'PENDING'
																? 'warning'
																: order.status === 'PROCESSING'
																? 'primary'
																: 'default'
														}
													>
														{order.status}
													</Chip>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>

								<Divider />
								<div>
									<h4 className="text-medium font-semibold mb-3">Customer Information</h4>
									<Address address={order.address} readonly />
								</div>

								<Divider />

								{/* Order Items */}
								<div>
									<h4 className="text-medium font-semibold mb-3">Order Items</h4>
									<Table removeWrapper aria-label="Order items table">
										<TableHeader>
											<TableColumn>PRODUCT</TableColumn>
											<TableColumn>QUANTITY</TableColumn>
											<TableColumn>PRICE</TableColumn>
											<TableColumn>TOTAL</TableColumn>
											<TableColumn>REVIEW</TableColumn>
										</TableHeader>
										<TableBody>
											{order.orderItems.map(item => (
												<TableRow key={item.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<img
																src={item.product.images?.[0]}
																alt={item.product.name}
																className="w-10 h-10 rounded-lg object-cover"
															/>
															<span>{item.product.name}</span>
														</div>
													</TableCell>
													<TableCell>{item.quantity}</TableCell>
													<TableCell>${item.price.toFixed(2)}</TableCell>
													<TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
													<TableCell>
														<Chip size="sm" variant="flat" color={item.hasReview ? 'success' : 'warning'}>
															{item.hasReview ? 'Reviewed' : 'Not Reviewed'}
														</Chip>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default OrderDetailsModal
