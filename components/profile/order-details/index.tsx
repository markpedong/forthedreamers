import { statusColorMap } from '@/constants'
import { TOrderItems, TReviewPayload } from '@/constants/types'
import { dateFormatter } from '@/utils/helpers'
import {
	addToast,
	Button,
	Chip,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Textarea
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { STATUS } from '@prisma/client'
import React, { Dispatch, FC, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rate } from 'antd'
import { submitReview } from '@/lib/server'

type Props = {
	selectedOrder: TOrderItems | null
	setSelectedOrder: Dispatch<React.SetStateAction<TOrderItems | null>>
}

const variants = {
	initial: (direction: any) => ({ x: direction === 'next' ? '-100%' : '100%', opacity: 0 }),
	animate: { x: 0, opacity: 1, transition: { duration: 0.15, ease: 'easeIn' } },
	exit: (direction: any) => ({
		x: direction === 'next' ? '100%' : '-100%',
		opacity: 0,
		transition: { duration: 0.15, ease: 'easeIn' }
	})
}

const OrderDetails: FC<Props> = ({ setSelectedOrder, selectedOrder }) => {
	const [currTab, setCurrTab] = useState('review')
	const [hasOpened, setHasOpened] = useState(false)
	const [userReview, setUserReview] = useState<TReviewPayload[]>([])

	useEffect(() => {
		if (selectedOrder) {
			setCurrTab('')
			setUserReview(
				selectedOrder?.orderItems?.map(item => ({
					id: item.id,
					productId: item.productId,
					ordersId: item.ordersId,
					rating: 0,
					comment: ''
				}))
			)

			setHasOpened(true)
		} else {
			setHasOpened(false)
		}
	}, [selectedOrder])

	return (
		<Modal
			isOpen={!!selectedOrder}
			onOpenChange={() => {
				setSelectedOrder(null)
				setCurrTab('')
			}}
			size="2xl"
		>
			<ModalContent>
				{onClose =>
					selectedOrder && (
						<>
							<ModalHeader>
								<div className="flex flex-col gap-1">
									<div
										className="flex gap-1 items-center cursor-pointer"
										onClick={() => {
											setCurrTab('')
											setUserReview([])
										}}
									>
										{currTab === 'review' && <Icon icon="lucide:arrow-left" />}
										<h3>{currTab === 'review' ? 'Back' : 'Order Details'}</h3>
									</div>
									<span className="text-sm text-default-500">Order ID: {selectedOrder.id}</span>
								</div>
							</ModalHeader>
							<ModalBody>
								<AnimatePresence mode="wait" custom={currTab === 'review' ? 'prev' : 'next'}>
									<motion.div
										key={currTab}
										custom={currTab === 'review' ? 'prev' : 'next'}
										initial={hasOpened ? 'initial' : { opacity: 1, x: 0 }} // Skip animation on open
										animate="animate"
										exit="exit"
										variants={variants}
									>
										{currTab !== 'review' ? (
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
																	<TableCell className="text-center">
																		${(item.price * item.quantity).toFixed(2)}
																	</TableCell>
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
										) : (
											<div className="flex flex-col gap-1">
												{selectedOrder?.orderItems.map((item, idx) => (
													<div className="flex flex-col gap-1 mb-6" key={item.id}>
														<div className="flex justify-between items-center">
															<div className="flex gap-1 font-bold">
																{idx + 1}. {item.product.name}
															</div>
															<Rate
																onChange={val => {
																	setUserReview(prev => {
																		return prev.map(review => {
																			if (review.id === item.id) {
																				return {
																					...review,
																					rating: val
																				}
																			}
																			return review
																		})
																	})
																}}
															/>
														</div>
														<Textarea
															required
															placeholder="Write a review"
															onChange={e => {
																setUserReview(prev => {
																	return prev.map(review => {
																		if (review.id === item.id) {
																			return {
																				...review,
																				comment: e.target.value
																			}
																		}
																		return review
																	})
																})
															}}
														/>
													</div>
												))}
											</div>
										)}
									</motion.div>
								</AnimatePresence>
							</ModalBody>
							<ModalFooter>
								<Button color="primary" variant="faded" onPress={onClose}>
									Close
								</Button>
								{selectedOrder.status === STATUS.DELIVERED && (
									<Button
										color="primary"
										variant="solid"
										startContent={<Icon icon="lucide:star" />}
										onPress={async () => {
											if (currTab === 'review') {
												if (userReview.some(item => item.rating === 0)) {
													addToast({ title: 'Rating is required', color: 'warning' })
													return
												}

												if (userReview.some(item => item.comment?.length < 10)) {
													addToast({ title: 'Review must be at least 10 characters', color: 'warning' })
													return
												}

												const res = await submitReview(userReview)
												if (res.success) {
													setUserReview([])
													addToast({ title: 'Review submitted successfully!', color: 'success' })
													onClose()
												}
											} else {
												setCurrTab('review')
											}
										}}
										// isDisabled={
										//   currTab === 'review' && userReview?.some(review => review.comment === '' || review.rating === 0)
										// }
									>
										{currTab === 'review' ? 'Submit Review' : 'Write a Review'}
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
