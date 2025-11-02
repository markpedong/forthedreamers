'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    total: '$299.99',
    items: 1,
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: '#12344',
    customer: 'Jane Smith',
    total: '$149.99',
    items: 1,
    status: 'Processing',
    date: '2024-01-14',
  },
  {
    id: '#12343',
    customer: 'Bob Johnson',
    total: '$89.99',
    items: 2,
    status: 'Shipped',
    date: '2024-01-13',
  },
  {
    id: '#12342',
    customer: 'Alice Williams',
    total: '$199.99',
    items: 1,
    status: 'Pending',
    date: '2024-01-12',
  },
  {
    id: '#12341',
    customer: 'Charlie Brown',
    total: '$449.99',
    items: 3,
    status: 'Completed',
    date: '2024-01-11',
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<(typeof initialOrders)[number] | null>();
  const [orders, setOrders] = useState(initialOrders);
  const [toast, setToast] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    //@ts-ignore
    if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'amount-high') return Number.parseFloat(b.total) - Number.parseFloat(a.total);
    if (sortBy === 'amount-low') return Number.parseFloat(a.total) - Number.parseFloat(b.total);
    if (sortBy === 'customer') return a.customer.localeCompare(b.customer);
    return 0;
  });

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    showNotification(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handlePrintInvoice = (orderId: string) => {
    showNotification(`Invoice for ${orderId} printing...`);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId));
    showNotification(`Order ${orderId} has been cancelled`);
    setSelectedOrder(null);
  };

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
          <p className='text-muted-foreground mt-1'>View and manage all orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-2.5 w-4 h-4 text-muted-foreground' />
                <Input
                  placeholder='Search orders...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full md:w-40'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='Pending'>Pending</SelectItem>
                <SelectItem value='Processing'>Processing</SelectItem>
                <SelectItem value='Shipped'>Shipped</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-full md:w-40'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recent'>Most Recent</SelectItem>
                <SelectItem value='amount-high'>Amount (High)</SelectItem>
                <SelectItem value='amount-low'>Amount (Low)</SelectItem>
                <SelectItem value='customer'>Customer (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className='font-medium'>{order.total}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : order.status === 'Shipped'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className='w-4 h-4 mr-2' />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintInvoice(order.id)}>
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>{selectedOrder.id}</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Customer</p>
                  <p className='font-medium'>{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Date</p>
                  <p className='font-medium'>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Items</p>
                  <p className='font-medium'>{selectedOrder.items}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Total</p>
                  <p className='font-medium'>{selectedOrder.total}</p>
                </div>
              </div>
              <div>
                <p className='text-sm text-muted-foreground mb-2'>Update Status</p>
                <Select onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedOrder.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Pending'>Pending</SelectItem>
                    <SelectItem value='Processing'>Processing</SelectItem>
                    <SelectItem value='Shipped'>Shipped</SelectItem>
                    <SelectItem value='Completed'>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </div>
  );
}
