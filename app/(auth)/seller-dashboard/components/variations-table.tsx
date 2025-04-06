import React, { FC } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { TVariationItem } from '@/constants/types'

const VariationsTable: FC<{ variations: TVariationItem[] }> = ({ variations }) => {
	return (
		<Table className="max-w-full" removeWrapper isCompact>
			<TableHeader>
				<TableColumn>{null}</TableColumn>
				<TableColumn>LABEL</TableColumn>
				<TableColumn>STOCK</TableColumn>
				<TableColumn>PRICE</TableColumn>
				<TableColumn>DISCOUNTED PRICE</TableColumn>
			</TableHeader>
			<TableBody>
				{variations.map(variation => (
					<TableRow key={variation.id}>
						<TableCell>{null}</TableCell>
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
