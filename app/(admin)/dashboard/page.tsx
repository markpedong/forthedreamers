'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
} from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240 },
  { month: 'Feb', revenue: 3000, orders: 221 },
  { month: 'Mar', revenue: 2000, orders: 229 },
  { month: 'Apr', revenue: 2780, orders: 200 },
  { month: 'May', revenue: 1890, orders: 229 },
  { month: 'Jun', revenue: 2390, orders: 200 },
  { month: 'Jul', revenue: 3490, orders: 210 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Sports', value: 20 },
];

const colors = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
];

const recentOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    amount: '$299.99',
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: '#12344',
    customer: 'Jane Smith',
    amount: '$149.99',
    status: 'Processing',
    date: '2024-01-14',
  },
  {
    id: '#12343',
    customer: 'Bob Johnson',
    amount: '$89.99',
    status: 'Pending',
    date: '2024-01-13',
  },
  {
    id: '#12342',
    customer: 'Alice Williams',
    amount: '$199.99',
    status: 'Completed',
    date: '2024-01-12',
  },
];

const statCards = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: TrendingUp, trend: 'up' },
  { title: 'Total Orders', value: '1,234', change: '+15%', icon: ShoppingBag, trend: 'up' },
  { title: 'Total Products', value: '456', change: '+3%', icon: Package, trend: 'up' },
  { title: 'Active Users', value: '789', change: '-4.3%', icon: Users, trend: 'down' },
];

export default function AdminDashboard() {
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [toast, setToast] = useState('');

  const handleViewAll = () => {
    setShowAllOrders(true);
    showNotification('Viewing all orders');
  };

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground mt-1'>
          Welcome back, Admin. Here's your business overview.
        </p>
      </div>

      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.trend === 'up';

          return (
            <Card key={card.title}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{card.value}</div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {isPositive ? (
                    <ArrowUpRight className='w-3 h-3' />
                  ) : (
                    <ArrowDownRight className='w-3 h-3' />
                  )}
                  {card.change} from last month
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Revenue Chart */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray='3 3' stroke='var(--color-border)' />
                <XAxis stroke='var(--color-muted-foreground)' />
                <YAxis stroke='var(--color-muted-foreground)' />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  stroke='var(--color-chart-1)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='orders'
                  stroke='var(--color-chart-2)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: `1px solid var(--color-border)`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Button variant='outline' size='sm' onClick={handleViewAll}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-border'>
                  <th className='text-left py-3 px-4 font-medium text-sm'>Order ID</th>
                  <th className='text-left py-3 px-4 font-medium text-sm'>Customer</th>
                  <th className='text-left py-3 px-4 font-medium text-sm'>Amount</th>
                  <th className='text-left py-3 px-4 font-medium text-sm'>Status</th>
                  <th className='text-left py-3 px-4 font-medium text-sm'>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className='border-b border-border hover:bg-muted/50'>
                    <td className='py-3 px-4 text-sm font-medium'>{order.id}</td>
                    <td className='py-3 px-4 text-sm'>{order.customer}</td>
                    <td className='py-3 px-4 text-sm font-medium'>{order.amount}</td>
                    <td className='py-3 px-4 text-sm'>
                      <span
                        className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }
                      `}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-sm text-muted-foreground'>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showAllOrders && (
        <Dialog open={showAllOrders} onOpenChange={setShowAllOrders}>
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle>All Orders</DialogTitle>
              <DialogDescription>Complete order history</DialogDescription>
            </DialogHeader>
            <div className='max-h-96 overflow-y-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-border'>
                    <th className='text-left py-3 px-4 font-medium text-sm'>Order ID</th>
                    <th className='text-left py-3 px-4 font-medium text-sm'>Customer</th>
                    <th className='text-left py-3 px-4 font-medium text-sm'>Amount</th>
                    <th className='text-left py-3 px-4 font-medium text-sm'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className='border-b border-border'>
                      <td className='py-3 px-4 text-sm font-medium'>{order.id}</td>
                      <td className='py-3 px-4 text-sm'>{order.customer}</td>
                      <td className='py-3 px-4 text-sm font-medium'>{order.amount}</td>
                      <td className='py-3 px-4 text-sm'>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
