import React, { FC } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { TVariationItem } from '@/constants/types'

const VariationsTable: FC<{ variations: TVariationItem[] }> = ({ variations }) => {
	return (
		<Table className="max-w-full" removeWrapper isCompact>
			<TableHeader>
				<TableColumn className='text-xs'>LABEL</TableColumn>
				<TableColumn className='text-xs'>STOCK</TableColumn>
				<TableColumn className='text-xs'>PRICE</TableColumn>
				<TableColumn className='text-xs'>DISCOUNTED PRICE</TableColumn>
			</TableHeader>
			<TableBody>
				{variations.map(variation => (
					<TableRow key={variation.id}>
						<TableCell className='text-xs'>{variation.label}</TableCell>
						<TableCell className='text-xs'>{variation.stock}</TableCell>
						<TableCell className='text-xs'>${variation.price.toFixed(2)}</TableCell>
						<TableCell className='text-xs'>{variation.discountedPrice ? `$${variation.discountedPrice.toFixed(2)}` : '-'}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

export default VariationsTable
