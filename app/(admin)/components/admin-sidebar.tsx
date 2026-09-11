'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Settings,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { FC } from 'react';
import { USER_ROLE } from '@/generated/prisma';
import { useAppSelector } from '@/redux/store';
import { Route } from 'next';
import { Logo } from '@/components/brand/logo';

const Sidebar: FC = () => {
  const user = useAppSelector(state => state.userData.data);
  const pathname = usePathname();
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Users',
      href: '/users',
      icon: Users,
      allowed: user?.role === USER_ROLE.ADMIN,
    },
    {
      label: 'Categories',
      href: '/dashboard/categories',
      icon: ShoppingBag,
      allowed: user?.role === USER_ROLE.ADMIN,
    },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Shipping', href: '/settings/shipping', icon: Truck, allowed: user?.role === USER_ROLE.SELLER },
  ];
  const visibleNavItems = navItems.filter(item => item.allowed === undefined || item.allowed === true);

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard" aria-label="For the Dreamers dashboard" className="inline-flex">
          <Logo className="text-sidebar-foreground" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-3">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">For the Dreamers studio</div>
      </div>
    </aside>
  );
};

export default Sidebar;
