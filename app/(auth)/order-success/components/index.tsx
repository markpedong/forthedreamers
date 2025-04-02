'use client'

import { removeServerCookie } from '@/lib/server'
import { setProfileTab } from '@/redux/slices/appSlice'
import { useAppDispatch } from '@/redux/store'
import { deleteOrderID } from '@/utils/request'
import { Button, Card, CardBody, Divider } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

type Props = {
	orderId: string
}

const OrderSuccess: FC<Props> = ({ orderId }) => {
	const { push } = useRouter()
	const dispatch = useAppDispatch()

	const handleUserLeave = async (path: string) => {
		await removeServerCookie('orderID')
		push(path)
	}

	useEffect(() => {
		const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
			event.preventDefault()
			event.returnValue = ''

			handleUserLeave('/')
		}

		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [])

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			<Card>
				<CardBody className="flex flex-col items-center gap-6 py-12">
					<div className="rounded-full bg-success/10 p-4">
						<Icon icon="lucide:check" className="h-12 w-12 text-success" />
					</div>

					<div className="text-center">
						<h1 className="text-2xl font-bold mb-2">Order Completed!</h1>
						<p className="text-default-500">Thank you for your purchase. Your order has been placed successfully.</p>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-default-500">Order ID:</span>
						<span className="font-medium">{orderId}</span>
					</div>

					<Divider className="w-full" />

					<div className="flex flex-col sm:flex-row gap-3 w-full">
						<Button
							variant="bordered"
							color="primary"
							onPress={() => {
								handleUserLeave('/profile')
								dispatch(setProfileTab('Orders'))
							}}
							startContent={<Icon icon="lucide:package" />}
							fullWidth
						>
							View Orders
						</Button>
						<Button
							color="primary"
							onPress={() => handleUserLeave('/shop')}
							startContent={<Icon icon="lucide:shopping-bag" />}
							fullWidth
						>
							Continue Shopping
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	)
}

export default OrderSuccess
