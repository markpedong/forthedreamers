import PaymentMethods from '@/components/profile/payment-methods'
import React, { FC } from 'react'
import { PAYMENT_TYPE, PaymentMethods as TPaymentMethod } from '@prisma/client'
import AddEditPaymentMethods from '@/components/profile/payment-methodsAddEdit'
import { Typography } from 'antd'
import { Button, useDisclosure } from '@heroui/react'
import { useAppDispatch } from '@/redux/store'
import { setPaymentMethod } from '@/redux/slices/userSlice'

const PaymentMethod: FC<{ data: TPaymentMethod[] }> = ({ data }) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const dispatch = useAppDispatch()

	console.log(JSON.stringify(data))
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
						className=""
						size="sm"
					>
						New
					</Button>
				)}
			</div>
			<div className="grid gap-3 mt-8">
				{data?.map(method => (
					<PaymentMethods key={method.id} method={method} />
				))}
			</div>
		</div>
	)
}

export default PaymentMethod
