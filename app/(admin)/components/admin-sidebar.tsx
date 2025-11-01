'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Users, Shield, Key, FileText, Menu, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Roles', href: '/admin/roles', icon: Shield },
  { label: 'API Keys', href: '/admin/api-keys', icon: Key },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        className='fixed top-4 left-4 md:hidden z-40'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className='size-5' /> : <Menu className='size-5' />}
      </Button>

      <aside
        className={cn(
          'fixed md:relative w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-30',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className='p-6 border-b border-sidebar-border flex items-center gap-2'>
          <div className='size-8 bg-primary rounded-lg flex items-center justify-center'>
            <span className='text-primary-foreground text-sm font-bold'>A</span>
          </div>
          <h1 className='text-base font-semibold text-sidebar-foreground'>Admin</h1>
        </div>

        <nav className='flex-1 p-3 space-y-1 overflow-y-auto'>
          {menuItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <Icon className='size-4' />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-sidebar-border'>
          <p className='text-xs text-sidebar-foreground/50'>© 2025 Admin</p>
        </div>
      </aside>

      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 md:hidden z-20'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
