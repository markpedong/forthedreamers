'use client';

import type { FC, PropsWithChildren } from 'react';
import { ShoppingBag, TrendingUp, BarChart3 } from 'lucide-react';

const SellerPageWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex min-h-screen bg-gradient-to-br from-background via-background to-secondary'>
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 flex-col justify-between p-12 relative overflow-hidden'>
        {/* Decorative gradient orbs */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -mr-48 -mt-48 opacity-40' />
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl -ml-48 -mb-48 opacity-40' />

        <div className='relative z-10'>
          <div className='mb-4 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center'>
            <ShoppingBag className='w-6 h-6 text-primary-foreground' />
          </div>
          <h2 className='text-3xl font-bold text-foreground mb-2'>Your Seller Hub</h2>
          <p className='text-muted-foreground text-lg'>
            Manage, grow, and scale your e-commerce business
          </p>
        </div>

        <div className='relative z-10 space-y-6'>
          <div className='group cursor-default'>
            <div className='flex items-start gap-4 p-4 rounded-lg bg-black/ backdrop-blur-sm border border-white/30 hover:bg-black/70 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10'>
              <div className='mt-1 p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors'>
                <TrendingUp className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h3 className='font-semibold text-foreground'>Real-time Analytics</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Track sales, orders, and customer behavior
                </p>
              </div>
            </div>
          </div>

          <div className='group cursor-default'>
            <div className='flex items-start gap-4 p-4 rounded-lg bg-black/50 backdrop-blur-sm border border-white/30 hover:bg-black/70 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10'>
              <div className='mt-1 p-2 rounded-md bg-accent/10 group-hover:bg-accent/20 transition-colors'>
                <BarChart3 className='w-5 h-5 text-accent' />
              </div>
              <div>
                <h3 className='font-semibold text-foreground'>Growth Tools</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Marketing, promotions, and inventory management
                </p>
              </div>
            </div>
          </div>

          <div className='group cursor-default'>
            <div className='flex items-start gap-4 p-4 rounded-lg bg-black/50 backdrop-blur-sm border border-white/30 hover:bg-black/70 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10'>
              <div className='mt-1 p-2 rounded-md bg-secondary-foreground/10 group-hover:bg-secondary-foreground/20 transition-colors'>
                <ShoppingBag className='w-5 h-5 text-secondary-foreground' />
              </div>
              <div>
                <h3 className='font-semibold text-foreground'>24/7 Support</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Dedicated support team ready to help
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='relative z-10 pt-8 border-t border-white/20'>
          <p className='text-xs text-muted-foreground'>Trusted by 50,000+ sellers worldwide</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className='flex flex-1 items-center justify-center p-4 md:p-8'>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
};

export default SellerPageWrapper;
