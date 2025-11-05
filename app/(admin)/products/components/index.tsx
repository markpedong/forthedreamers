'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreVertical, Eye, Edit2, Trash2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { ProductFormModal } from '@/components/product/product-form-modal';
import { deleteProduct } from '@/app/actions/products';
import { useToast } from '@/hooks/use-toast';

// Mock data based on Prisma schema
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
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const handleDeleteClick = (product: { id: number; name: string }) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(productToDelete.id);

      if (result.success) {
        toast({
          title: 'Success',
          description: `Product "${productToDelete.name}" deleted successfully`,
        });
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        // In a real app, you would refetch the products list here
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete product',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (product: any) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const handleStatusToggle = (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    toast({
      title: 'Status Updated',
      description: `Product status changed to ${newStatus}`,
    });
    // TODO: Call API to update status
  };

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl font-bold tracking-tight'>Products</h1>
            <p className='text-muted-foreground mt-2'>Manage your product catalog</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} size='lg' className='gap-2 shadow-sm'>
            <Plus className='h-5 w-5' /> Create Product
          </Button>
        </div>

        <div className='rounded-lg border border-border bg-card shadow-sm'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='font-semibold'>Product</TableHead>
                <TableHead className='font-semibold'>Brand</TableHead>
                <TableHead className='font-semibold'>Price</TableHead>
                <TableHead className='font-semibold'>Status</TableHead>
                <TableHead className='font-semibold'>Rating</TableHead>
                <TableHead className='font-semibold'>Sales</TableHead>
                <TableHead className='font-semibold'>Stock</TableHead>
                <TableHead className='font-semibold'>Active</TableHead>
                <TableHead className='text-right font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id} className='group'>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{product.brand || '—'}</TableCell>
                  <TableCell className='font-semibold'>
                    ${product.basePrice?.toFixed(2) || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === 'ACTIVE'
                          ? 'default'
                          : product.status === 'INACTIVE'
                            ? 'secondary'
                            : 'outline'
                      }
                      className='font-medium'
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.rating > 0 ? (
                      <div className='flex items-center gap-1'>
                        <span className='font-medium'>{product.rating}</span>
                        <span className='text-yellow-500'>★</span>
                        <span className='text-muted-foreground text-xs'>
                          ({product.reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className='text-muted-foreground text-sm'>No reviews</span>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{product.sold.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock > 0
                          ? 'text-green-600 font-medium'
                          : 'text-destructive font-medium'
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.status === 'ACTIVE'}
                      onCheckedChange={() => handleStatusToggle(product.id, product.status)}
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/products/${product.id}`}
                            className='flex items-center gap-2 cursor-pointer'
                          >
                            <Eye className='h-4 w-4' />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(product)}
                          className='flex items-center gap-2'
                        >
                          <Edit2 className='h-4 w-4' />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick({ id: product.id, name: product.name })}
                          className='flex items-center gap-2'
                          variant='destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                          Delete
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

      <ProductFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        mode='create'
        onSuccess={() => {
          // Refresh products list
        }}
      />

      <ProductFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        mode='edit'
        product={productToEdit}
        onSuccess={() => {
          // Refresh products list
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
