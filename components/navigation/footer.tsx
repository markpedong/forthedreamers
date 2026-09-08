'use client';

import { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import classNames from 'classnames';
import { useIsMobile } from '@/hooks/useIsMobile';

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

  return (
    <footer className={classNames('mx-auto max-w-7xl px-4 py-16 pb-6', isMobile && 'pb-24')}>
      <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <h4 className="text-lg font-bold uppercase tracking-tighter">ForTheDreamers</h4>
          <p className="text-sm leading-relaxed text-neutral-500">
            A digital space for the modern minimalist. Curated with care, designed for life.
          </p>
        </div>
        <Section title="Shop" items={links.shop} />
        <Section title="Support" items={links.support} />
      </div>
      <div className="pt-8 text-center text-xs text-neutral-400 md:text-left">
        © {new Date().getFullYear()} ForTheDreamers. All rights reserved.
      </div>
    </footer>
  );
};

const Section: FC<{ title: string; items: { label: string; href: string }[] }> = ({ title, items }) => (
  <div>
    <h5 className="mb-4 font-medium">{title}</h5>
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
