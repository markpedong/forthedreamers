import React, { FC, useState, useTransition } from 'react'
import { Popover, PopoverTrigger, PopoverContent, Button, addToast } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/utils/request'

const DeleteProductPopover: FC<{ id: string }> = ({ id }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isDeleting, startDeleting] = useTransition()
	const router = useRouter()

	const onDelete = () => {
		startDeleting(async () => {
			const res = await deleteProduct(id)

			if (res.success) {
				addToast({ title: 'Success', description: 'Product deleted successfully', color: 'success' })
				setIsOpen(false)
				router.refresh()
			}
		})
	}

	return (
		<Popover placement="left" isOpen={isOpen} onOpenChange={setIsOpen}>
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
						<Button size="sm" variant="flat" color="default" onPress={() => setIsOpen(false)}>
							Cancel
						</Button>
						<Button size="sm" color="danger" onPress={onDelete} disabled={isDeleting} isLoading={isDeleting}>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default DeleteProductPopover
