'use client';

import { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import classNames from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePathname } from 'next/navigation';
import { isDashboardRoute } from '@/constants';

const links = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/products?sortBy=createdAt&order=desc' },
    { label: 'Best Sellers', href: '/products?sortBy=sold&order=desc' },
  ],
  support: [
    { label: 'Help & Support', href: '/support' },
    { label: 'Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
};

const Footer: FC = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isDashboardRoute(pathname)) return null;

  return (
    <footer className={classNames('mx-auto max-w-7xl px-4 py-10 pb-6 md:py-16', isMobile && 'pb-24')}>
      <div className="mb-10 grid grid-cols-1 gap-8 md:mb-16 md:grid-cols-3 md:gap-12">
        <div className="space-y-3 md:space-y-4">
          <h4 className="text-base font-bold uppercase tracking-tighter md:text-lg">ForTheDreamers</h4>
          <p className="text-sm leading-relaxed text-neutral-500">
            A digital space for the modern minimalist. Curated with care, designed for life.
          </p>
        </div>
        <Section title="Shop" items={links.shop} />
        <Section title="Support" items={links.support} />
      </div>
      <div className="pt-6 text-center text-xs text-neutral-400 md:pt-8 md:text-left">
        © {new Date().getFullYear()} ForTheDreamers. All rights reserved.
      </div>
    </footer>
  );
};

const Section: FC<{ title: string; items: { label: string; href: string }[] }> = ({ title, items }) => (
  <div>
    <h5 className="mb-3 font-medium md:mb-4">{title}</h5>
    <ul className="space-y-2 text-sm text-neutral-500">
      {items.map(item => (
        <li key={item.href}>
          <Link href={item.href as Route} className="hover:text-primary">{item.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
