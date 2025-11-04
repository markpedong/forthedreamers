'use client';

import type { FC, PropsWithChildren } from 'react';
import { ShoppingBag, TrendingUp, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    desc: 'Track sales, orders, and customer behavior',
  },
  {
    icon: BarChart3,
    title: 'Growth Tools',
    desc: 'Marketing, promotions, and inventory management',
  },
  {
    icon: ShoppingBag,
    title: '24/7 Support',
    desc: 'Dedicated support team ready to help',
  },
];

const SellerPageWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex min-h-screen bg-gradient-to-br from-background via-background to-secondary dark:from-background dark:via-background dark:to-secondary'>
      <div className='relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/20'>
        <div className='absolute top-0 right-0 w-96 h-96 -mr-48 -mt-48 rounded-full blur-3xl opacity-40 bg-gradient-to-br from-accent/20 to-transparent dark:from-accent/30' />
        <div className='absolute bottom-0 left-0 w-96 h-96 -ml-48 -mb-48 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-primary/20 to-transparent dark:from-primary/30' />

        <div className='relative z-10'>
          <div className='mb-4 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center'>
            <ShoppingBag className='w-6 h-6 text-primary-foreground' />
          </div>
          <h2 className='text-3xl font-bold text-foreground mb-2'>Your Seller Hub</h2>
          <p className='text-lg text-muted-foreground'>
            Manage, grow, and scale your e-commerce business
          </p>
        </div>

        <div className='relative z-10 space-y-5'>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className='group flex items-start gap-4 p-4 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:shadow-lg dark:bg-black/30 dark:hover:bg-black/50 dark:border-white/10'
            >
              <div className='mt-1 p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <Icon className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h3 className='font-semibold text-foreground'>{title}</h3>
                <p className='text-sm text-muted-foreground mt-1'>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className='relative z-10 pt-8 border-t border-white/20 dark:border-white/10 text-xs text-muted-foreground'>
          Trusted by 50,000+ sellers worldwide
        </p>
      </div>

      <div className='flex flex-1 items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
};

export default SellerPageWrapper;
