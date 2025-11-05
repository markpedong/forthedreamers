'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProductFormModal from './product-form-modal';
import { ProColumn } from '@/lib/types';
import { ProTable } from '@/components/reusable/table';

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

const Products = () => {
  const [deleteDialog, setDeleteDialog] = useState<{ id: number; name: string } | null>(null);
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

  const toggleStatus = (id: number, status: string) => {
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    toast.info(`Status changed to ${newStatus}`);
    // TODO: API call to update
  };

  const columns: ProColumn<typeof mockProducts[number]>[] = [
    {
      title: 'Product',
      dataIndex: 'name',
    },
    {
      title: 'Brand',
    },
    {
      title: 'Price',
    },
    {
      title: 'Status',
    },
    {
      title: 'Sales',
    },
    {
      title: 'Stock',
    },
    {
      title: 'Active',
      search: false,
    },
    {
      title: 'Actions',
    },
  ];
  return (
    <main className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold'>Products</h1>
            <p className='text-muted-foreground'>Manage your product catalog</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size='lg' className='gap-2 shadow-sm'>
            <Plus className='h-5 w-5' /> Create Product
          </Button>
        </header>

        <ProTable<any>
          rowKey='id'
          columns={columns?.map((item) => ({ ...item, align: 'center' }))}
          dataSource={mockProducts}
        />

        <div className='rounded-lg border bg-card shadow-sm'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {[
                  'Product',
                  'Brand',
                  'Price',
                  'Status',
                  'Rating',
                  'Sales',
                  'Stock',
                  'Active',
                  'Actions',
                ].map((h) => (
                  <TableHead key={h} className='font-semibold'>
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className='font-medium'>{p.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{p.brand}</TableCell>
                  <TableCell className='font-semibold'>${p.basePrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.rating ? (
                      <div className='flex items-center gap-1'>
                        <span>{p.rating}</span>
                        <span className='text-yellow-500'>★</span>
                        <span className='text-xs text-muted-foreground'>({p.reviewCount})</span>
                      </div>
                    ) : (
                      <span className='text-sm text-muted-foreground'>No reviews</span>
                    )}
                  </TableCell>
                  <TableCell>{p.sold.toLocaleString()}</TableCell>
                  <TableCell className={p.stock > 0 ? 'text-green-600' : 'text-destructive'}>
                    {p.stock}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={p.status === 'ACTIVE'}
                      onCheckedChange={() => toggleStatus(p.id, p.status)}
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${p.id}`} className='flex items-center gap-2'>
                            <Eye className='h-4 w-4' /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditProduct(p);
                            setEditOpen(true);
                          }}
                          className='flex items-center gap-2'
                        >
                          <Edit2 className='h-4 w-4' /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ id: p.id, name: p.name })}
                          className='flex items-center gap-2 text-destructive'
                        >
                          <Trash2 className='h-4 w-4' /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductFormModal open={createOpen} onOpenChange={setCreateOpen} mode='create' />
      <ProductFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        mode='edit'
        product={editProduct}
      />

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Products;
