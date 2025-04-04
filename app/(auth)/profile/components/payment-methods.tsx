import PaymentMethods from '@/components/profile/payment-methods'
import AddEditPaymentMethods from '@/components/profile/payment-methodsAddEdit'
import { setPaymentMethod } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { getPaymentMethod } from '@/utils/request'
import { Button, useDisclosure } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { Typography } from 'antd'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const PaymentMethod: FC = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const dispatch = useAppDispatch()
	const { data: session } = useSession()
	const { data = [] } = useQuery({
		queryKey: ['payment-method', session?.user?.id],
		queryFn: async () => {
			const response = await getPaymentMethod(`${session?.user?.id}`)

			return response.data
		}
	})

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
					<PaymentMethods key={method.id} method={method} />
				))}
			</div>
		</div>
	)
}

export default PaymentMethod
