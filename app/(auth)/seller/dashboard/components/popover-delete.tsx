import React from 'react'
import { Popover, PopoverTrigger, PopoverContent, Button } from '@heroui/react'
import { Icon } from '@iconify/react'

interface DeleteProductPopoverProps {
	onDelete: () => void
}

const DeleteProductPopover = ({ onDelete }: DeleteProductPopoverProps) => {
	return (
		<Popover placement="left">
			<PopoverTrigger>
				<Button isIconOnly size="sm" variant="light" color="danger">
					<Icon icon="lucide:trash" className="w-4 h-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="px-4 py-3">
					<div className="text-small font-bold">Confirm Deletion</div>
					<div className="text-tiny text-default-500 mt-1">
						This action cannot be undone. Are you sure you want to delete this product?
					</div>
					<div className="flex justify-end gap-2 mt-4">
						<Button size="sm" variant="flat" color="default">
							Cancel
						</Button>
						<Button size="sm" color="danger" onPress={onDelete}>
							Delete
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default DeleteProductPopover
