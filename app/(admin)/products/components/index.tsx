'use client';

import { FC, useState } from 'react';
import { Edit2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ProductFormModal from './product-form-modal';
import { ProColumn } from '@/lib/types';
import { ProTable } from '@/components/reusable/table';
import AlertDialog from '@/components/reusable/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { Product } from '@/generated/prisma';

const mockProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    brand: 'AudioTech',
    basePrice: 299.99,
    rating: 4.5,
    reviewCount: 328,
    sold: 1200,
    stock: 45,
    status: 'ACTIVE',
    category: 'Electronics',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    brand: 'SoundMax',
    basePrice: 149.99,
    rating: 4.3,
    reviewCount: 156,
    sold: 890,
    stock: 32,
    status: 'ACTIVE',
    category: 'Electronics',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    name: 'Wireless Charging Case',
    slug: 'wireless-charging-case',
    brand: 'TechGear',
    basePrice: 79.99,
    rating: 4.6,
    reviewCount: 423,
    sold: 2100,
    stock: 0,
    status: 'ACTIVE',
    category: 'Accessories',
    createdAt: new Date('2024-01-05'),
  },
];

const Products: FC<{ products: Product[] }> = ({ products }) => {
  console.log('products', products);
  const [deleteDialog, setDeleteDialog] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    setIsDeleting(true);
    try {
      // const res = await deleteProduct(deleteDialog.id);
      // if (res.success) {
      //   toast.success(`Deleted "${deleteDialog.name}"`);
      //   setDeleteDialog(null);
      // } else toast.error(res.error || 'Failed to delete product');
    } catch {
      toast.error('Unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleStatus = (id: string, status: string) => {
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    toast.info(`Status changed to ${newStatus}`);
    // TODO: API call to update
  };

  const columns: ProColumn<Product>[] = [
    {
      title: 'Product',
      render: (_, record) => <span className='font-medium'>{record.name}</span>,
    },
    {
      title: 'Brand',
      render: (_, record) => <span className='text-muted-foreground'>{record.brand}</span>,
    },
    {
      title: 'Price',
      render: (_, record) => <span className='font-semibold'>${record.basePrice?.toFixed(2)}</span>,
    },
    {
      title: 'Status',
      search: false,
      render: (_, record) => (
        <Badge variant={record.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {record.status}
        </Badge>
      ),
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
        );
      },
    },
    {
      title: 'Sales',
      search: false,
      render: (_, record) => record.sold?.toLocaleString(),
    },
    {
      title: 'Stock',
      render: (_, record) => (
        <span className={Number(record.stock) > 0 ? 'text-green-600' : 'text-destructive'}>
          {record.stock}
        </span>
      ),
    },
    {
      title: 'Active',
      search: false,
      render: (_, record) => (
        <Switch
          checked={record.status === 'ACTIVE'}
          onCheckedChange={() => toggleStatus(record.id, record.status)}
        />
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon'>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem asChild>
              <Link href={`/products/${record.slug}`} className='flex items-center gap-2'>
                <Eye className='h-4 w-4' /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditProduct(record);
                setEditOpen(true);
              }}
              className='flex items-center gap-2'
            >
              <Edit2 className='h-4 w-4' /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setDeleteDialog({ id: record.id, name: record.name })}
              className='flex items-center gap-2 text-destructive'
            >
              <Trash2 className='h-4 w-4' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className='px-4 py-8 space-y-8'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold'>Products</h1>
            <p className='text-muted-foreground'>Manage your product catalog</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size='lg' className='gap-2 shadow-sm'>
            <Plus className='h-5 w-5' /> Create Product
          </Button>
        </header>

        <ProTable<Product>
          rowKey='id'
          columns={columns?.map((item) => ({ ...item, align: 'center' }))}
          dataSource={products}
        />
      </div>

      <ProductFormModal open={createOpen} onOpenChange={setCreateOpen} mode='create' />
      <ProductFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode='edit'
        product={editProduct}
      />
      <AlertDialog
        title='Delete Product'
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
        description='Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.'
        cancelText='Cancel'
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Products;
