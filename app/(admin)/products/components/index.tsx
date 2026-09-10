'use client';

import { FC, useState } from 'react';
import { Edit2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductFormModal from './product-form-modal';
import { ProColumn, TProduct, ProductFormData, DropdownMenuItemType } from '@/lib/types';
import AlertDialog from '@/components/reusable/alert-dialog';
import Link from 'next/link';
import DropDown from '@/components/reusable/dropdown';
import ProTable from '@/components/pro-table';
import { Switch } from '@/components/ui/switch';
import {
  useDeleteProductMutation,
  useSaveProductMutation,
  useToggleProductStatusMutation,
} from '@/services/useMutation';

const Products: FC<{ initialProducts: TProduct[]; initialCategories: import('@/generated/prisma').Category[] }> = ({
  initialProducts,
  initialCategories,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'EDIT' | 'CREATE'>('CREATE');
  const [product, setProduct] = useState<TProduct>();
  const [rows, setRows] = useState(initialProducts);
  const deleteMutation = useDeleteProductMutation(() => {
    setDeleteDialog(null);
    setProduct(undefined);
  });
  const statusMutation = useToggleProductStatusMutation(({ id, active }) => {
    setRows(state =>
      state.map(item => (item.id === id ? { ...item, status: active ? 'INACTIVE' : 'ACTIVE' } : item))
    );
  });
  const saveMutation = useSaveProductMutation((savedProduct, savedType) => {
    setRows(state =>
      savedType === 'EDIT'
        ? state.map(item => (item.id === savedProduct.id ? savedProduct : item))
        : [savedProduct, ...state]
    );
    setProduct(savedProduct);
    setOpen(false);
  });
  const isPending = deleteMutation.isPending || statusMutation.isPending || saveMutation.isPending;
  const handleDelete = () => {
    if (!deleteDialog) return;
    deleteMutation.mutate(deleteDialog.id);
  };
  const toggleStatus = (id: string) => {
    const active = rows.find(p => p.id === id)?.status !== 'ACTIVE';
    setRows(state => state.map(item => (item.id === id ? { ...item, status: active ? 'ACTIVE' : 'INACTIVE' } : item)));
    statusMutation.mutate({ id, active });
  };

  const dropdownMenus = (record: TProduct): DropdownMenuItemType[] => [
    {
      label: (
        <Link href={`/products/${record.slug}`} className="flex items-center gap-2">
          <Eye className="h-4 w-4" /> View Details
        </Link>
      ),
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Edit2 className="h-4 w-4" /> Edit
        </span>
      ),
      onClick: () => {
        setType('EDIT');
        setProduct(record);
        setOpen(true);
      },
      hasSeparatorBelow: true,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Delete
        </span>
      ),
      isDestructive: true,
      onClick: () => setDeleteDialog({ id: record.id, name: record.name }),
    },
  ];

  const columns: ProColumn<TProduct>[] = [
    {
      title: 'No.',
      search: false,
      render: (_, record) => rows.findIndex(item => item.id === record.id) + 1,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      search: true,
      render: (_, record) => <span className="font-medium">{record.name}</span>,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      search: true,
      render: (_, record) => <span className="text-muted-foreground">{record.brand}</span>,
    },
    {
      title: 'Price',
      render: (_, record) => <span className="font-semibold">${record.basePrice?.toFixed(2)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInTable: true,
      search: true,
      renderFormItem: () => null,
    },
    {
      title: 'Rating',
      search: false,
      render: (_, record) => {
        return record.rating ? (
          <div className="flex justify-center items-center gap-1">
            <span>{record.rating}</span>
            <span className="text-yellow-500">★</span>
            <span className="text-xs text-muted-foreground">({record.reviewCount})</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No reviews</span>
        );
      },
    },
    {
      title: 'Sales',
      search: false,
      render: (_, record) => record.sold?.toLocaleString(),
    },
    {
      title: 'Status',
      search: false,
      render: (_, record) => (
        <Switch
          disabled={isPending}
          checked={record.status === 'ACTIVE'}
          onCheckedChange={() => toggleStatus(record.id)}
        />
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <DropDown
          trigger={
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          }
          menus={dropdownMenus(record)}
        />
      ),
    },
  ];

  const handleSubmitProduct = (data: ProductFormData, type: 'CREATE' | 'EDIT') => {
    saveMutation.mutate({ data, type });
  };

  return (
    <>
      <div className="px-4 py-8 space-y-8 [&_[data-slot=table]]:table-fixed [&_[data-slot=table-cell]]:text-center [&_[data-slot=table-head]]:text-center">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => {
              setType('CREATE');
              setOpen(true);
              setProduct(undefined);
            }}
            size="lg"
            className="gap-2 shadow-sm"
          >
            <Plus className="h-5 w-5" /> Create Product
          </Button>
        </header>

        <ProTable<TProduct>
          rowKey="id"
          columns={columns?.map(item => ({ ...item, align: 'center' }))}
          dataSource={rows}
          isLoading={false}
          toolBarRender={false}
          search={{ defaultCollapsed: false }}
        />
      </div>
      <ProductFormModal
        open={open}
        setOpen={setOpen}
        type={type}
        categories={initialCategories}
        onSubmit={handleSubmitProduct}
        isSubmitting={isPending}
        initialProduct={type === 'EDIT' ? product : undefined}
      />
      <AlertDialog
        title="Delete Product"
        open={!!deleteDialog}
        description='Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.'
        cancelText="Cancel"
        confirmText={isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(null)}
      />
    </>
  );
};

export default Products;
