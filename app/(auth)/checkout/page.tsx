'use client'
import { useAppSelector } from '@/redux/store'
import React from 'react'
import {
	Card,
	CardBody,
	Button,
	RadioGroup,
	Radio,
	Divider,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Select,
	SelectItem
} from '@heroui/react'

type Props = {}

const Page = (props: Props) => {
	const cartItem = useAppSelector(state => state.user.cartItems)

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
								<RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
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

								<Button
									variant="flat"
									startContent={<Icon icon="lucide:plus" />}
									onPress={() => setIsNewAddressModalOpen(true)}
								>
									Add New Address
								</Button>
							</div>
						</CardBody>
					</Card>

					{/* Payment Method */}
					<Card>
						<CardBody>
							<h2 className="text-lg font-semibold mb-4">Payment Method</h2>
							<RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
								<Radio value="card" description="Pay securely with your credit/debit card">
									Credit/Debit Card
								</Radio>
								<Radio value="paypal" description="Fast and secure payment with PayPal">
									PayPal
								</Radio>
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
											<img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
										</div>
										<div className="flex flex-1 flex-col">
											<h4 className="text-sm font-medium">{item.productName}</h4>
											<p className="text-xs text-default-500">{item.variationLabel}</p>
											<div className="flex items-center justify-between mt-auto">
												<span className="text-xs">Qty: {item.quantity}</span>
												<span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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

								<Button color="primary" size="lg" onPress={handlePlaceOrder} isDisabled={!selectedAddressId} fullWidth>
									Place Order
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>

			{/* New Address Modal */}
			<Modal isOpen={isNewAddressModalOpen} onOpenChange={setIsNewAddressModalOpen} size="2xl">
				<ModalContent>
					{onClose => (
						<form onSubmit={handleAddNewAddress}>
							<ModalHeader>Add New Address</ModalHeader>
							<ModalBody>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<Input label="First Name" placeholder="Enter your first name" isRequired />
									<Input label="Last Name" placeholder="Enter your last name" isRequired />
									<Input
										label="Street Address"
										placeholder="Enter street address"
										className="md:col-span-2"
										isRequired
									/>
									<Input label="Street Number" placeholder="Enter street number" isRequired />
									<Input label="Landmark" placeholder="Enter landmark (optional)" />
									<Input label="City" placeholder="Enter city" isRequired />
									<Input label="State/Province" placeholder="Enter state/province" />
									<Input label="ZIP Code" placeholder="Enter ZIP code" />
									<Input label="Country" placeholder="Enter country" isRequired />
									<Select label="Address Type" className="md:col-span-2" defaultSelectedKeys={['NONE']}>
										<SelectItem key="HOME" value="HOME">
											Home
										</SelectItem>
										<SelectItem key="WORK" value="WORK">
											Work
										</SelectItem>
										<SelectItem key="NONE" value="NONE">
											Other
										</SelectItem>
									</Select>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="flat" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" type="submit">
									Save Address
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}

export default Page
