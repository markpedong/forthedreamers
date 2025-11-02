//@ts-nocheck
'use client';

import { useState } from 'react';
import { CreditCard, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

const initialTransactions = [
  {
    id: 'TXN001',
    amount: '$299.99',
    method: 'Credit Card',
    type: 'Charge',
    status: 'Completed',
    date: '2024-01-15',
    customer: 'John Doe',
  },
  {
    id: 'TXN002',
    amount: '$149.99',
    method: 'PayPal',
    type: 'Charge',
    status: 'Completed',
    date: '2024-01-14',
    customer: 'Jane Smith',
  },
  {
    id: 'TXN003',
    amount: '$89.99',
    method: 'Debit Card',
    type: 'Charge',
    status: 'Failed',
    date: '2024-01-13',
    customer: 'Bob Johnson',
  },
  {
    id: 'TXN004',
    amount: '$199.99',
    method: 'Apple Pay',
    type: 'Charge',
    status: 'Completed',
    date: '2024-01-12',
    customer: 'Alice Williams',
  },
  {
    id: 'TXN005',
    amount: '$49.99',
    method: 'Credit Card',
    type: 'Refund',
    status: 'Completed',
    date: '2024-01-11',
    customer: 'Charlie Brown',
  },
];

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toast, setToast] = useState('');

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    showNotification(`Viewing transaction ${transaction.id}`);
  };

  const handleRefund = (transactionId) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    const newTransaction = {
      ...transaction,
      id: `TXN${Math.random().toString().slice(2, 5)}`,
      type: 'Refund',
      amount: '-' + transaction.amount,
      date: new Date().toISOString().slice(0, 10),
    };
    setTransactions([newTransaction, ...transactions]);
    showNotification(`Refund of ${transaction.amount} initiated for ${transaction.customer}`);
  };

  const handleDownloadReceipt = (transactionId) => {
    showNotification(`Receipt for ${transactionId} downloaded`);
  };

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Payments</h1>
        <p className='text-muted-foreground mt-1'>Manage transactions and refunds</p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231.89</div>
            <p className='text-xs text-muted-foreground mt-1'>
              From {transactions.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Pending Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$449.97</div>
            <p className='text-xs text-muted-foreground mt-1'>2 pending refunds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>98%</div>
            <p className='text-xs text-muted-foreground mt-1'>4 of 5 successful</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>All payment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className='font-medium'>{transaction.id}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell className='font-medium'>{transaction.amount}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <CreditCard className='w-4 h-4 text-muted-foreground' />
                        {transaction.method}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${transaction.type === 'Refund' ? 'text-destructive' : 'text-green-600'}`}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='w-4 h-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                            View Details
                          </DropdownMenuItem>
                          {transaction.type === 'Charge' && (
                            <DropdownMenuItem onClick={() => handleRefund(transaction.id)}>
                              <RefreshCw className='w-4 h-4 mr-2' />
                              Refund
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDownloadReceipt(transaction.id)}>
                            Download Receipt
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

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>{selectedTransaction.id}</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Customer</p>
                  <p className='font-medium'>{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Amount</p>
                  <p className='font-medium'>{selectedTransaction.amount}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Method</p>
                  <p className='font-medium'>{selectedTransaction.method}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <p className='font-medium'>{selectedTransaction.status}</p>
                </div>
              </div>
              {selectedTransaction.type === 'Charge' && (
                <Button
                  className='w-full'
                  onClick={() => {
                    handleRefund(selectedTransaction.id);
                    setSelectedTransaction(null);
                  }}
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Process Refund
                </Button>
              )}
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
