'use client'

import AddEditAddress from '@/components/profile/addressAddEdit'
import { setCartOpen, setHasChangesInCart, setHasDefaultAddress } from '@/redux/slices/appSlice'
import { setAddress, setCartItems } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { getCardIcon } from '@/utils/helpers'
import { checkoutCart } from '@/utils/request'
import { addToast, Button, Card, CardBody, Divider, Radio, RadioGroup, useDisclosure } from '@heroui/react'
import { Icon } from '@iconify/react'
import { Addresses, PAYMENT_TYPE, PaymentMethods } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

type Props = {
	addresses: Addresses[]
	paymentMethods: PaymentMethods[]
}

const Checkout: FC<Props> = ({ addresses, paymentMethods }) => {
	const cartItems = useAppSelector(state => state.user.cartItems)
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { back, push } = useRouter()
	const dispatch = useAppDispatch()
	const [selectedAddressId, setSelectedAddressId] = useState<string>('')
	const [selectedPayment, setSelectedPayment] = useState<string>('')
	const subtotal = cartItems.reduce((sum, item) => sum + item.variation.price * item.quantity, 0)
	const shippingCost = 10
	const tax = subtotal * 0.1
	const total = subtotal + shippingCost + tax
	const visa = paymentMethods?.find(pm => pm.type === PAYMENT_TYPE.VISA)
	const mc = paymentMethods?.find(pm => pm.type === PAYMENT_TYPE.MASTERCARD)

	const onBackToCart = () => {
		dispatch(setCartOpen(true))
		back()
	}

	const handlePlaceOrder = async () => {
		const res = await checkoutCart({
			ids: cartItems.map(item => item.id),
			address: selectedAddressId,
			payment: selectedPayment
		})

		if (!res.success) return

		addToast({ title: 'Success', description: 'Order placed successfully', color: 'success' })
		dispatch(setCartOpen(false))
		dispatch(setCartItems([]))
		dispatch(setHasChangesInCart(false))
		dispatch(setAddress(null))
		push('/order-success')
	}

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="flex items-center gap-2 mb-6">
				<Button variant="light" onPress={onBackToCart} startContent={<Icon icon="lucide:arrow-left" />}>
					Back to Cart
				</Button>
				<h1 className="text-2xl font-bold">Checkout</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Delivery Address */}
				<div className="lg:col-span-2">
					<Card className="mb-6">
						<CardBody>
							<h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
							<div className="flex flex-col gap-4">
								<RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} color="primary">
									{addresses.map(address => (
										<Radio
											key={address.id}
											value={address.id}
											description={
												<div className="text-sm">
													<div className="flex items-center gap-2">
														<span className="font-medium">
															{address.firstName} {address.lastName}
														</span>
														<span className="text-xs px-2 py-0.5 bg-default-100 rounded-full">{address.type}</span>
													</div>
													<p className="text-default-500">
														{address.number} {address.street}
														{address.landmark && `, ${address.landmark}`}
													</p>
													<p className="text-default-500">
														{address.city}, {address.state} {address.zipCode}
													</p>
													<p className="text-default-500">{address.country}</p>
												</div>
											}
										>
											Select Address
										</Radio>
									))}
								</RadioGroup>
								<Button variant="flat" startContent={<Icon icon="lucide:plus" />} onPress={() => onOpen()}>
									Add New Address
								</Button>
							</div>
						</CardBody>
					</Card>
					<Card>
						<CardBody>
							<h2 className="text-lg font-semibold mb-4">Payment Method</h2>
							<RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
								{paymentMethods?.find(pm => pm.type === PAYMENT_TYPE.CASH_ON_DELIVERY) && (
									<Radio value="CASH_ON_DELIVERY" description="Pay cash on delivery">
										<div className="flex items-center gap-2">
											<Icon icon={getCardIcon('CASH_ON_DELIVERY')} width={20} height={20} />
											Cash on Delivery
										</div>
									</Radio>
								)}
								{visa && (
									<Radio value="VISA" description={`****${visa.cardNumber?.slice(-4)} / ${visa.expiryDate}`}>
										<div className="flex items-center gap-2">
											<Icon icon={getCardIcon('VISA')} width={20} height={20} />
											Visa
										</div>
									</Radio>
								)}
								{mc && (
									<Radio value="MASTERCARD" description={`****${mc.cardNumber?.slice(-4)} / ${mc.expiryDate}`}>
										<div className="flex items-center gap-2">
											<Icon icon={getCardIcon('MASTERCARD')} width={20} height={20} />
											MasterCard
										</div>
									</Radio>
								)}
								{paymentMethods?.find(pm => pm.type === PAYMENT_TYPE.APPLEPAY) && (
									<Radio value="APPLEPAY" description="Pay with Apple Pay">
										<div className="flex items-center gap-2">
											<Icon icon={getCardIcon('APPLEPAY')} width={20} height={20} />
											Apple Pay
										</div>
									</Radio>
								)}
								{paymentMethods?.find(pm => pm.type === PAYMENT_TYPE.PAYPAL) && (
									<Radio value="PAYPAL" description="Fast and secure payment with PayPal">
										<div className="flex items-center gap-2">
											<Icon icon={getCardIcon('PAYPAL')} width={20} height={20} />
											Paypal
										</div>
									</Radio>
								)}
							</RadioGroup>
						</CardBody>
					</Card>
				</div>

				{/* Order Summary */}
				<div className="lg:col-span-1">
					<Card>
						<CardBody>
							<h2 className="text-lg font-semibold mb-4">Order Summary</h2>
							<div className="flex flex-col gap-4">
								{cartItems.map(item => (
									<div key={item.id} className="flex gap-3">
										<div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
											<img
												src={item.product.images?.[0]}
												alt={item.product.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex flex-1 flex-col">
											<h4 className="text-sm font-medium">{item.product.name}</h4>
											<p className="text-xs text-default-500">{item.variation.label}</p>
											<div className="flex items-center justify-between mt-auto">
												<span className="text-xs">Qty: {item.quantity}</span>
												<span className="text-sm font-medium">
													${(item.variation.price * item.quantity).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								))}

								<Divider />

								<div className="flex flex-col gap-2">
									<div className="flex justify-between">
										<span className="text-sm">Subtotal</span>
										<span className="text-sm">${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">Shipping</span>
										<span className="text-sm">${shippingCost.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">Tax</span>
										<span className="text-sm">${tax.toFixed(2)}</span>
									</div>
									<Divider />
									<div className="flex justify-between">
										<span className="font-medium">Total</span>
										<span className="font-medium">${total.toFixed(2)}</span>
									</div>
								</div>

								<Button
									color="primary"
									size="lg"
									onPress={handlePlaceOrder}
									isDisabled={!selectedAddressId || !selectedPayment}
									fullWidth
								>
									Place Order
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>

			<AddEditAddress isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	)
}

export default Checkout
