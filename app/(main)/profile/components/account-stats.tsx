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
      icon: Package
    },
    {
      label: 'Wishlist Items',
      value: stats.wishlistCount,
      icon: Heart
    },
    {
      label: 'Reviews Written',
      value: stats.reviewCount,
      icon: Star
    }
  ]

  return (
    <Card className='shadow-none'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl'>Account overview</CardTitle>
        <CardDescription>Real activity from your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
          {statItems.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className='flex items-center gap-4 py-5 first:pt-0 last:pb-0 sm:flex-col sm:px-6 sm:py-3 sm:text-center sm:first:pt-3 sm:last:pb-3'
            >
              <div className='rounded-full bg-primary/10 p-3'>
                <Icon className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-3xl font-semibold tracking-tight text-foreground'>{value}</p>
                <p className='text-sm text-muted-foreground'>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {stats.orderCount === 0 && stats.wishlistCount === 0 && stats.reviewCount === 0 && (
          <div className='mt-6 border-t border-border pt-6 text-center text-muted-foreground'>
            <p className='font-medium'>No activity yet</p>
            <p className='mt-1 text-sm'>Start shopping to see your activity here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AccountStats
