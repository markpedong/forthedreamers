import Address from '@/components/profile/address'
import AddEditAddress from '@/components/profile/addressAddEdit'
import { setHasDefaultAddress } from '@/redux/slices/appSlice'
import { setAddress } from '@/redux/slices/userSlice'
import { useAppDispatch } from '@/redux/store'
import { getAddress } from '@/utils/request'
import { Button, useDisclosure } from '@heroui/react'
import { ADDRESS_TYPE, Addresses as TAddresses } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Typography } from 'antd'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const Addresses: FC = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const dispatch = useAppDispatch()
	const { data: session } = useSession()
	const { data = [] } = useQuery({
		queryKey: ['addresses', session?.user?.id],
		queryFn: async () => {
			const response = await getAddress(`${session?.user?.id}`)

			if (response?.data.findIndex(address => address.type === ADDRESS_TYPE.DEFAULT) !== -1) {
				dispatch(setHasDefaultAddress(true))
			}

			return response.data
		}
	})

	return (
		<>
			<AddEditAddress isOpen={isOpen} onOpenChange={onOpenChange} />
			<div className="flex justify-between">
				<Typography.Title level={4}>Addresses</Typography.Title>
				<Button
					onPress={() => {
						dispatch(setAddress(null))
						onOpen()
					}}
					color="primary"
					size="sm"
				>
					New
				</Button>
			</div>
			<div className="mt-7 flex flex-col gap-2">
				{data?.map(address => (
					<Address address={address} key={address.id} openEditModal={() => onOpen()} />
				))}
			</div>
		</>
	)
}

export default Addresses
