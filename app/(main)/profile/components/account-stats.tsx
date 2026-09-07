'use client'

import { FC } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Heart, Star } from 'lucide-react'

type Stats = {
  orderCount: number
  wishlistCount: number
  reviewCount: number
}

type AccountStatsProps = {
  stats: Stats
}

const AccountStats: FC<AccountStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Orders',
      value: stats.orderCount,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      label: 'Wishlist Items',
      value: stats.wishlistCount,
      icon: Heart,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30'
    },
    {
      label: 'Reviews Written',
      value: stats.reviewCount,
      icon: Star,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
        <CardDescription>Your account activity at a glance</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='grid gap-4 sm:grid-cols-3'>
          {statItems.map(({ label, value, icon: Icon, color, bgColor }) => (
            <div
              key={label}
              className='flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center'
            >
              <div className={`rounded-full p-3 ${bgColor}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground'>{value}</p>
                <p className='text-sm text-muted-foreground'>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {stats.orderCount === 0 && stats.wishlistCount === 0 && stats.reviewCount === 0 && (
          <div className='mt-6 text-center text-muted-foreground'>
            <p className='font-medium'>No activity yet</p>
            <p className='text-sm mt-1'>
              Start shopping to see your activity here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountStats
