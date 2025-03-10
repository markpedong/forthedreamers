import React, { FC } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Image, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'

type Props = {}

const CartDrawer: FC<Props> = () => {
	const isCartOpen = useSelector(state => state.app.isCartOpen)

	return (
		<Drawer isOpen={isCartOpen} onOpenChange={onOpenChange} placement="right">
			<DrawerContent>
				{onClose => (
					<>
						<DrawerHeader className="flex flex-col gap-1">
							<div className="flex items-center justify-between">
								<h3>Your Cart</h3>
								<span className="text-sm text-default-500">
									{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
								</span>
							</div>
						</DrawerHeader>
						<DrawerBody>
							{cartItems.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-full gap-2">
									<Icon icon="lucide:shopping-cart" className="text-4xl text-default-300" />
									<p className="text-default-500">Your cart is empty</p>
								</div>
							) : (
								<div className="flex flex-col gap-4">
									{cartItems.map(item => (
										<div key={item.id} className="flex gap-3">
											<div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
												<Image src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
											</div>
											<div className="flex flex-1 flex-col">
												<div className="flex justify-between">
													<h4 className="text-sm font-medium">{item.productName}</h4>
													<Button
														isIconOnly
														size="sm"
														variant="light"
														onPress={() => onRemoveItem(item.id)}
														aria-label="Remove item"
													>
														<Icon icon="lucide:x" size={16} />
													</Button>
												</div>
												<p className="text-xs text-default-500">{item.variationLabel}</p>
												<div className="flex items-center justify-between mt-auto">
													<div className="flex items-center gap-1">
														<Button
															isIconOnly
															size="sm"
															variant="flat"
															onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
															isDisabled={item.quantity <= 1}
															className="h-6 w-6 min-w-0"
														>
															<Icon icon="lucide:minus" size={14} />
														</Button>
														<span className="text-xs w-6 text-center">{item.quantity}</span>
														<Button
															isIconOnly
															size="sm"
															variant="flat"
															onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
															className="h-6 w-6 min-w-0"
														>
															<Icon icon="lucide:plus" size={14} />
														</Button>
													</div>
													<p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</DrawerBody>
						<Divider />
						<DrawerFooter>
							<div className="flex flex-col gap-4 w-full">
								<div className="flex justify-between">
									<span className="font-medium">Subtotal</span>
									<span className="font-medium">${subtotal.toFixed(2)}</span>
								</div>
								<p className="text-xs text-default-500">Shipping and taxes calculated at checkout</p>
								<Button color="primary" isDisabled={cartItems.length === 0} fullWidth>
									Checkout
								</Button>
								<Button variant="flat" onPress={onClose} fullWidth>
									Continue Shopping
								</Button>
							</div>
						</DrawerFooter>
					</>
				)}
			</DrawerContent>
		</Drawer>
	)
}

export default CartDrawer
