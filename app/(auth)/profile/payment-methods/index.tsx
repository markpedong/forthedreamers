'use client'

import PaymentMethod from '@/components/profile/payment-methods'
import AddEditPaymentMethods from '@/components/profile/payment-methodsAddEdit'
import { setPaymentMethod } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { Button, useDisclosure } from '@heroui/react'
import { PaymentMethods as TPaymentMethods } from '@prisma/client'
import { Typography } from 'antd'
import { FC } from 'react'

const PaymentMethods: FC<{ data: TPaymentMethods[] }> = ({ data }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const dispatch = useAppDispatch()

	return (
		<div>
			<AddEditPaymentMethods
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				displayDefault={!data?.some(method => method.isDefault)}
				data={data}
			/>
			<div className="flex justify-between">
				<Typography.Title level={4}>Payment Methods</Typography.Title>
				{Array.isArray(data) && data.length < 5 && (
					<Button
						onPress={() => {
							dispatch(setPaymentMethod(null))
							onOpen()
						}}
						color="primary"
						size="sm"
					>
						New
					</Button>
				)}
			</div>
			<div className="grid gap-3 mt-8">
				{data?.map(method => (
					<PaymentMethod key={method.id} method={method} />
				))}
			</div>
		</div>
	)
}

export default PaymentMethods
