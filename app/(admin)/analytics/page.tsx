//@ts-nocheck
'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const revenueData = [
  { month: 'Jan', revenue: 4000, target: 3500 },
  { month: 'Feb', revenue: 3000, target: 3500 },
  { month: 'Mar', revenue: 2000, target: 3500 },
  { month: 'Apr', revenue: 2780, target: 3500 },
  { month: 'May', revenue: 1890, target: 3500 },
  { month: 'Jun', revenue: 2390, target: 3500 },
  { month: 'Jul', revenue: 3490, target: 3500 },
];

const userGrowthData = [
  { month: 'Jan', users: 400, activeUsers: 240 },
  { month: 'Feb', users: 520, activeUsers: 380 },
  { month: 'Mar', users: 680, activeUsers: 490 },
  { month: 'Apr', users: 780, activeUsers: 600 },
  { month: 'May', users: 920, activeUsers: 720 },
  { month: 'Jun', users: 1050, activeUsers: 800 },
  { month: 'Jul', users: 1200, activeUsers: 950 },
];

const conversionData = [
  { week: 'W1', conversion: 2.4, bounceRate: 24 },
  { week: 'W2', conversion: 1.3, bounceRate: 23 },
  { week: 'W3', conversion: 2.0, bounceRate: 22 },
  { week: 'W4', conversion: 2.78, bounceRate: 20 },
  { week: 'W5', conversion: 1.46, bounceRate: 19 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [toast, setToast] = useState('');

  const getRevenueData = () => {
    if (dateRange === '7d') {
      return revenueData;
    } else if (dateRange === '30d') {
      return revenueData.map((d) => ({ ...d, revenue: d.revenue * 1.2 }));
    } else {
      return revenueData.map((d) => ({ ...d, revenue: d.revenue * 1.5 }));
    }
  };

  const getUserGrowthData = () => {
    if (dateRange === '7d') {
      return userGrowthData;
    } else if (dateRange === '30d') {
      return userGrowthData.map((d) => ({
        ...d,
        users: d.users * 1.3,
        activeUsers: d.activeUsers * 1.3,
      }));
    } else {
      return userGrowthData.map((d) => ({
        ...d,
        users: d.users * 1.6,
        activeUsers: d.activeUsers * 1.6,
      }));
    }
  };

  const handleExportData = () => {
    showNotification(`Exporting analytics data for ${dateRange}...`);
  };

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
          <p className='text-muted-foreground mt-1'>Monitor your store's performance</p>
        </div>
        <div className='flex gap-2'>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='Date Range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportData}>Export</Button>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Target</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={getRevenueData()}>
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
                <Bar dataKey='revenue' fill='var(--color-chart-1)' radius={[8, 8, 0, 0]} />
                <Bar dataKey='target' fill='var(--color-chart-2)' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Total vs active users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <AreaChart data={getUserGrowthData()}>
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
                <Area
                  type='monotone'
                  dataKey='users'
                  stackId='1'
                  stroke='var(--color-chart-1)'
                  fill='var(--color-chart-1)'
                  fillOpacity={0.6}
                />
                <Area
                  type='monotone'
                  dataKey='activeUsers'
                  stackId='1'
                  stroke='var(--color-chart-2)'
                  fill='var(--color-chart-2)'
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Conversion Rate & Bounce Rate</CardTitle>
            <CardDescription>Weekly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={conversionData}>
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
                  dataKey='conversion'
                  stroke='var(--color-chart-1)'
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type='monotone'
                  dataKey='bounceRate'
                  stroke='var(--color-chart-3)'
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </div>
  );
}
