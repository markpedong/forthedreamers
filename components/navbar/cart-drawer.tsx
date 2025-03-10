import { useWithDispatch } from '@/hooks/useWithDispatch'
import { updateCartInDatabase } from '@/lib/server'
import { setCartOpen, setHasChangesInCart } from '@/redux/slices/appSlice'
import { increaseCartItem, reduceCartItem } from '@/redux/slices/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from '@heroui/react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = {}

const CartDrawer: FC<Props> = () => {
	const { isCartOpen, hasChangesInCart } = useAppSelector(state => state.app)
	const cartItems = useAppSelector(state => state.user.cartItems)
	const dispatch = useAppDispatch()
	const { fetchCartItem, removeCartItem } = useWithDispatch()
	const subtotal = cartItems.reduce((sum, item) => sum + item.variation.price * item.quantity, 0)
	const router = useRouter()

	const onOpenChange = async (isOpen: boolean) => {
		if (!isOpen) hasChanges()

		dispatch(setCartOpen(isOpen))
	}

	const hasChanges = async () => {
		dispatch(setHasChangesInCart(false))

		if (hasChangesInCart) {
			await updateCartInDatabase(cartItems)
			fetchCartItem()
			router.refresh()
		}
	}

	useEffect(() => {
		isCartOpen && fetchCartItem()
	}, [isCartOpen])

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasChangesInCart) {
				event.preventDefault()
				event.returnValue = ''

				hasChanges()
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [hasChangesInCart, cartItems])
	return (
		<Drawer
			isOpen={isCartOpen}
			onOpenChange={onOpenChange}
			placement="right"
			onClose={() => {
				dispatch(setCartOpen(false))
			}}
		>
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
												<Image
													src={item.product.images?.[0]}
													alt={item.product.name}
													className="h-full w-full object-cover"
													width={100}
													height={100}
												/>
											</div>
											<div className="flex flex-1 flex-col">
												<div className="flex justify-between">
													<h4 className="text-sm font-medium">{item.product.name}</h4>
													<Button
														isIconOnly
														size="sm"
														variant="light"
														onPress={() => removeCartItem(item.id)}
														aria-label="Remove item"
													>
														<Icon icon="lucide:x" width={16} />
													</Button>
												</div>
												<p className="text-xs text-default-500">{item.variation.label}</p>
												<div className="flex items-center justify-between mt-auto">
													<div className="flex items-center gap-1">
														<Button
															isIconOnly
															size="sm"
															variant="flat"
															onPress={() => {
																dispatch(setHasChangesInCart(true))
																dispatch(reduceCartItem(item.id))
															}}
															isDisabled={item.quantity < 2}
															className="h-6 w-6 min-w-0 cursor-pointer"
														>
															<Icon icon="lucide:minus" width={14} />
														</Button>
														<span className="text-xs w-6 text-center">{item.quantity}</span>
														<Button
															isIconOnly
															size="sm"
															variant="flat"
															onPress={() => {
																dispatch(setHasChangesInCart(true))
																dispatch(increaseCartItem(item.id))
															}}
															className="h-6 w-6 min-w-0 cursor-pointer"
															isDisabled={item.quantity > 9}
														>
															<Icon icon="lucide:plus" width={14} />
														</Button>
													</div>
													<p className="text-sm font-medium">${(item.variation.price * item.quantity).toFixed(2)}</p>
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
