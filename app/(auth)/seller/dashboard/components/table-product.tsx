import React, { FC } from 'react'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Avatar, Chip } from '@heroui/react'
import { Icon } from '@iconify/react'
import DeleteProductPopover from './popover-delete'
import { TProductItem } from '@/constants/types'

const statusColorMap = {
	active: 'success',
	draft: 'warning',
	out_of_stock: 'danger'
} as const

interface ProductTableProps {
	products: TProductItem[]
	onEdit: (product: TProductItem) => void
}

const ProductTable: FC<ProductTableProps> = ({ products, onEdit }) => {
	const onDelete = (productId: string) => {
		console.log('Delete product:', productId)
	}

	return (
		<Table aria-label="Products table">
			<TableHeader>
				<TableColumn>PRODUCT</TableColumn>
				<TableColumn>PRICE</TableColumn>
				<TableColumn>STOCK</TableColumn>
				<TableColumn>STATUS</TableColumn>
				<TableColumn>ACTIONS</TableColumn>
			</TableHeader>
			<TableBody>
				{products.map(product => {
					const firstVariation = product?.variations?.find(v => !!v.discountedPrice)

					return (
						<TableRow key={product.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar src={product?.images?.[0]} size="sm" />
									<span>{product.name}</span>
								</div>
							</TableCell>
							<TableCell>${firstVariation?.price.toFixed(2)}</TableCell>
							<TableCell>{firstVariation?.stock}</TableCell>
							<TableCell>
								<Chip
									color={statusColorMap[firstVariation?.stock ? 'active' : 'out_of_stock']}
									size="sm"
									variant="flat"
								>
									{firstVariation?.stock ? 'In Stock' : 'Out of Stock'}
								</Chip>
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button isIconOnly size="sm" variant="light" onPress={() => onEdit(product)}>
										<Icon icon="lucide:edit" className="w-4 h-4" />
									</Button>
									<DeleteProductPopover onDelete={() => onDelete(product.id)} />
								</div>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

export default ProductTable
