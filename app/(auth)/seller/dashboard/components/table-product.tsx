import { TProductItem } from '@/constants/types'
import {
	Avatar,
	Button,
	Link,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { DateFormatter } from '@internationalized/date'
import React, { FC, memo } from 'react'
import DeleteProductPopover from './popover-delete'
import VariationsTable from './variations-table'

interface ProductTableProps {
	products: TProductItem[]
	onEdit: (product: TProductItem) => void
}

const ProductTable: FC<ProductTableProps> = ({ products, onEdit }) => {
	const [openedKeys, setOpenedKeys] = React.useState<Record<string, boolean>>({})

	return (
		<Table aria-label="Products table" fullWidth>
			<TableHeader>
				<TableColumn>{null}</TableColumn>
				<TableColumn>PRODUCT</TableColumn>
				<TableColumn>DESCRIPTION</TableColumn>
				<TableColumn>CREATED ON</TableColumn>
				<TableColumn>ACTIONS</TableColumn>
			</TableHeader>
			<TableBody emptyContent="No rows to display.">
				{products.map(product => (
					<React.Fragment key={product.id}>
						<TableRow className="select-none">
							<TableCell onClick={() => setOpenedKeys(prev => ({ ...prev, [product.id]: !prev[product.id] }))}>
								<Icon
									icon="iconamoon:arrow-right-2"
									className={`w-4 h-4 transition-transform cursor-pointer ${openedKeys[product.id] ? 'rotate-90' : ''}`}
								/>
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-3">
									<Avatar src={product.images?.[0] || 'https://i.pravatar.cc/150?u=' + product.id} size="sm" />
									<Link className="cursor-pointer" href={`/products/${product.id}`} target="_blank" size="sm">
										{product.name}
									</Link>
								</div>
							</TableCell>
							<TableCell>
								<Tooltip content={product.description} showArrow className="w-[20rem]">
									<div className="text-md truncate w-[20rem]">{product.description}</div>
								</Tooltip>
							</TableCell>
							<TableCell>
								{new DateFormatter('en-US', {
									dateStyle: 'long',
									timeStyle: 'short'
								}).format(new Date(product.createdAt))}
							</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button isIconOnly size="sm" variant="light" onPress={() => onEdit(product)}>
										<Icon icon="lucide:edit" className="w-4 h-4" />
									</Button>
									<DeleteProductPopover id={product.id} key={product.id} />
								</div>
							</TableCell>
						</TableRow>
						{openedKeys[product.id] && (
							<TableRow>
								<TableCell>{null}</TableCell>
								<TableCell className="p-0" colSpan={5}>
									<div className="mt-5 mb-2 font-bold text-neutral-500 text-xs tracking-wide uppercase">
										{product.name}'s Variations
									</div>
									<VariationsTable variations={product.variations} />
								</TableCell>
								<TableCell className="hidden">{null}</TableCell>
								<TableCell className="hidden">{null}</TableCell>
								<TableCell className="hidden">{null}</TableCell>
							</TableRow>
						)}
					</React.Fragment>
				))}
			</TableBody>
		</Table>
	)
}

export default memo(ProductTable)
