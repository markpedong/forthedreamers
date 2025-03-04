import { ADDRESS_TYPE, Addresses } from '@prisma/client'
import React, { FC } from 'react'
import { Card, CardBody, Button } from '@heroui/react'
import { AiFillEdit } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { useAppSelector } from '@/redux/store'

type Props = {
	address: Addresses
}

const 	Address: FC<Props> = ({ address }) => {
	const darkMode = useAppSelector(s => s.app.darkMode)

	return (
		<Card key={address.id} className="w-full" shadow='sm'>
			<CardBody>
				<div className="flex justify-between items-start">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-medium">
								{address.firstName} {address.lastName} / {address.number}
							</span>
							{address.type === ADDRESS_TYPE.DEFAULT && (
								<span className="px-2 py-1 text-tiny bg-primary-50 text-primary rounded-full">Default</span>
							)}
						</div>
						<div className="text-default-500 text-xs">
							<p>{address.street}</p>
							<p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button isIconOnly size="sm" variant="light" aria-label="Edit address">
							<AiFillEdit className="text-default-500" size={12} color={darkMode ? 'white' : 'black'} />
						</Button>
						<Button isIconOnly size="sm" variant="light" aria-label="Delete address">
							<FaTrash className="text-danger" size={12} />
						</Button>
					</div>
				</div>
				{address.type === ADDRESS_TYPE.NONE && (
					<div className="mt-2 pt-2 border-t">
						<Button variant="flat" size="sm">
							Set as Default
						</Button>
					</div>
				)}
			</CardBody>
		</Card>
	)
}

export default Address
