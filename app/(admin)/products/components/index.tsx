'use client'

import { FC, useRef, useState, useTransition } from 'react'
import { Edit2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ProductFormModal from './product-form-modal'
import { TProduct, ProductFormData, DropdownMenuItemType } from '@/lib/types'
import AlertDialog from '@/components/reusable/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { tryWithToast } from '@/utils/helper'
import DropDown from '@/components/reusable/dropdown'
import ProTable from '@/components/pro-table'
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components'
import { useQueryCategories } from '@/hooks/useQuery'
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/lib/http'
import VariationTable from './variation-table'

const Products: FC = () => {
  const [deleteDialog, setDeleteDialog] = useState<{id: string; name: string} | null>(null)
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'EDIT' | 'CREATE'>('CREATE')
  const [product, setProduct] = useState<TProduct>()
  const actionRef = useRef<ActionType>(null)
  const {data: categories} = useQueryCategories()

  const handleDelete = () => {
    startTransition(async () => {
      const res = await tryWithToast(deleteProduct(deleteDialog!.id))

      if (res?.success) {
        toast.success(`Deleted "${deleteDialog?.name}"`)
        setDeleteDialog(null)
        setProduct(undefined)
        actionRef.current?.reload()
      }
    })
  }

  const toggleStatus = (id: string, status: string) => {
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    toast.info(`Status changed to ${newStatus}`)
    // TODO: API call to update
  }

  const dropdownMenus = (record: TProduct): DropdownMenuItemType[] => [
    {
      label: (
        <Link href={`/products/${record.slug}`} className='flex items-center gap-2'>
          <Eye className='h-4 w-4' /> View Details
        </Link>
      )
    },
    {
      label: (
        <span className='flex items-center gap-2'>
          <Edit2 className='h-4 w-4' /> Edit
        </span>
      ),
      onClick: () => {
        setType('EDIT')
        setProduct(record)
        setOpen(true)
      },
      hasSeparatorBelow: true
    },
    {
      label: (
        <span className='flex items-center gap-2'>
          <Trash2 className='h-4 w-4' /> Delete
        </span>
      ),
      isDestructive: true,
      onClick: () => setDeleteDialog({id: record.id, name: record.name})
    }
  ]

  const columns: ProColumns<TProduct>[] = [
    {
      title: 'Product',
      dataIndex: 'name',
      search: true,
      render: (_, record) => <span className='font-medium'>{record.name}</span>
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      search: true,
      render: (_, record) => <span className='text-muted-foreground'>{record.brand}</span>
    },
    {
      title: 'Price',
      render: (_, record) => <span className='font-semibold'>${record.basePrice?.toFixed(2)}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      search: true,
      renderFormItem: () => (
        <ProFormSelect
          options={[
            {label: 'Active', value: 'ACTIVE'},
            {label: 'Inactive', value: 'INACTIVE'},
            {label: 'Draft', value: 'DRAFT'}
          ]}
        />
      ),
      render: (_, record) => <Badge variant={record.status === 'ACTIVE' ? 'default' : 'secondary'}>{record.status}</Badge>
    },
    {
      title: 'Rating',
      search: false,
      render: (_, record) => {
        return record.rating ? (
          <div className='flex justify-center items-center gap-1'>
            <span>{record.rating}</span>
            <span className='text-yellow-500'>★</span>
            <span className='text-xs text-muted-foreground'>({record.reviewCount})</span>
          </div>
        ) : (
          <span className='text-sm text-muted-foreground'>No reviews</span>
        )
      }
    },
    {
      title: 'Sales',
      search: false,
      render: (_, record) => record.sold?.toLocaleString()
    },
    {
      title: 'Stock',
      render: (_, record) => <span className={Number(record.stock) > 0 ? 'text-green-600' : 'text-destructive'}>{record.stock}</span>
    },
    {
      title: 'Active',
      search: false,
      render: (_, record) => <Switch checked={record.status === 'ACTIVE'} onCheckedChange={() => toggleStatus(record.id, record.status)} />
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <DropDown
          trigger={
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          }
          menus={dropdownMenus(record)}
        />
      )
    }
  ]

  const handleSubmitProduct = async (data: ProductFormData, type: 'CREATE' | 'EDIT') => {
    const isEdit = type === 'EDIT'

    const res = isEdit ? await tryWithToast(updateProduct(data)) : await tryWithToast(createProduct(data))

    console.log('res', res)
    if (res?.success) {
      toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`)
      actionRef.current?.reload()
      setOpen(false)
    }
  }

  const fetchData = async (params: any) => {
    const res = await tryWithToast(getProducts(params))

    return {
      data: res?.data ?? [],
      total: res?.total ?? 0
    }
  }

  return (
    <>
      <div className='px-4 py-8 space-y-8'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold'>Products</h1>
            <p className='text-muted-foreground'>Manage your product catalog</p>
          </div>
          <Button
            onClick={() => {
              setType('CREATE')
              setOpen(true)
              setProduct(undefined)
            }}
            size='lg'
            className='gap-2 shadow-sm'
          >
            <Plus className='h-5 w-5' /> Create Product
          </Button>
        </header>

        <ProTable<TProduct>
          actionRef={actionRef}
          rowKey='id'
          columns={columns?.map(item => ({...item, align: 'center'}))}
          request={fetchData}
          toolBarRender={false}
          search={{defaultCollapsed: false}}
          expandable={{
            expandedRowRender: record => record.variants.length > 0 && <VariationTable variations={record.variants} />,
            rowExpandable: record => record.variants.length > 0
          }}
        />
      </div>
      <ProductFormModal
        open={open}
        setOpen={setOpen}
        type={type}
        categories={categories?.data ?? []}
        onSubmit={handleSubmitProduct}
        initialProduct={type === 'EDIT' ? product : undefined}
      />
      <AlertDialog
        title='Delete Product'
        open={!!deleteDialog}
        description='Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.'
        cancelText='Cancel'
        confirmText={isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(null)}
      />
    </>
  )
}

export default Products
