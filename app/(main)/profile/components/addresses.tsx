import Address from '@/components/address'
import AddressAddEdit from '@/components/addressAddEdit'
import { Button, useDisclosure } from '@heroui/react'
import { Addresses as TAddresses } from '@prisma/client'
import { Typography } from 'antd'
import { FC, useState } from 'react'

type Props = {
	data: TAddresses[]
}

const Addresses: FC<Props> = ({ data }) => {
	const [isNew, setIsNew] = useState(false)
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<div>
			<AddressAddEdit isNew={isNew} setIsNew={setIsNew} isOpen={isOpen} onOpenChange={onOpenChange} />
			<div className="flex justify-between">
				<Typography.Title level={4}>Addresses</Typography.Title>
				<Button
					onPress={() => {
						setIsNew(true)
						onOpen()
					}}
					className="customButton1"
					size="sm"
				>
					New
				</Button>
			</div>
			<div className="mt-7 flex flex-col gap-2">
				{data?.map(address => (
					<Address address={address} key={address.id} />
				))}
			</div>
		</div>
	)
}

export default Addresses
