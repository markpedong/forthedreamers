import AddressAddEdit from '@/components/addressAddEdit'
import { Button, useDisclosure } from '@heroui/react'
import { Typography } from 'antd'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

type Props = {}

const Addresses = (props: Props) => {
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
		</div>
	)
}

export default Addresses
