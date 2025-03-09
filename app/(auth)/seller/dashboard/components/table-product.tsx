import { TProductItem } from '@/constants/types'
import { Avatar, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { Icon } from '@iconify/react'
import { DateFormatter } from '@internationalized/date'
import React, { FC } from 'react'
import DeleteProductPopover from './popover-delete'
import VariationsTable from './variations-table'

// const statusColorMap = {
// 	active: 'success',
// 	draft: 'warning',
// 	out_of_stock: 'danger'
// } as const

interface ProductTableProps {
  products: TProductItem[]
  onEdit: (product: TProductItem) => void
}

const ProductTable: FC<ProductTableProps> = ({ products, onEdit }) => {
  const [openedKeys, setOpenedKeys] = React.useState<Record<string, boolean>>({})
  const onDelete = (productId: string) => {
    console.log('Delete product:', productId)
  }

  console.log('openedKeys', openedKeys)
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
                  <span>{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                {new DateFormatter('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short'
                }).format(product.createdAt)}
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

export default ProductTable
