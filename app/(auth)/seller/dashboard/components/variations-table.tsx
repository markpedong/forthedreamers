import React, { FC } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { TVariationItem } from '@/constants/types'

const VariationsTable: FC<{ variations: TVariationItem[] }> = ({ variations }) => {
	return (
		<Table aria-label="Product variations" className="max-w-full" isCompact>
			<TableHeader>
				<TableColumn>LABEL</TableColumn>
				<TableColumn>STOCK</TableColumn>
				<TableColumn>PRICE</TableColumn>
				<TableColumn>DISCOUNTED PRICE</TableColumn>
			</TableHeader>
			<TableBody>
				{variations.map(variation => (
					<TableRow key={variation.id}>
						<TableCell>{variation.label}</TableCell>
						<TableCell>{variation.stock}</TableCell>
						<TableCell>${variation.price.toFixed(2)}</TableCell>
						<TableCell>{variation.discountedPrice ? `$${variation.discountedPrice.toFixed(2)}` : '-'}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default VariationsTable
