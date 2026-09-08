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
    <div className="grid min-h-[100dvh] bg-muted/30 lg:grid-cols-[minmax(360px,0.8fr)_minmax(520px,1.2fr)]">
      <aside className="hidden border-r bg-foreground p-10 text-background lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div>
          <div className="mb-6 flex size-11 items-center justify-center rounded-xl border border-background/20 bg-background/10">
            <ShoppingBag className="size-5" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-background/55">For The Dreamers</p>
          <h2 className="max-w-md text-4xl font-medium tracking-tight">Your business, beautifully managed.</h2>
          <p className="mt-4 max-w-md leading-7 text-background/65">Manage your store, understand your sales, and keep growing.</p>
        </div>

        <div className="space-y-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 border-t border-background/15 pt-6">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/10">
                <Icon className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-background/55">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-background/45">A focused workspace for independent sellers.</p>
      </aside>

      <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
};

export default SellerPageWrapper;
