'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  BarChart3,
  Lock,
  Settings,
  LogOut as Logo,
  ShoppingBag
} from 'lucide-react'
import { FC } from 'react'
import { USER_ROLE } from '@/generated/prisma'
import { useAppSelector } from '@/redux/store'
import { Route } from 'next'

const Sidebar: FC = () => {
  const session = useAppSelector(state => state.appData.session)
  const pathname = usePathname()
  const navItems = [
    {label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard},
    {
      label: 'Users',
      href: '/users',
      icon: Users,
      allowed: session?.user.role === USER_ROLE.ADMIN
    },
    {
      label: 'Categories',
      href: '/categories',
      icon: ShoppingBag,
      allowed: session?.user.role === USER_ROLE.ADMIN
    },
    {label: 'Orders', href: '/orders', icon: ShoppingCart},
    {label: 'Products', href: '/products', icon: Package},
    {label: 'Payments', href: '/payments', icon: CreditCard},
    {label: 'Analytics', href: '/analytics', icon: BarChart3},
    {label: 'Security', href: '/security', icon: Lock},
    {label: 'Settings', href: '/settings', icon: Settings}
  ]
  const visibleNavItems = navItems.filter(item => item.allowed === undefined || item.allowed === true)

  return (
    <aside className='w-64 bg-sidebar border-r border-sidebar-border flex flex-col'>
      <div className='h-16 flex items-center px-6 border-b border-sidebar-border'>
        <Logo className='w-6 h-6 text-sidebar-primary mr-2' />
        <span className='font-bold text-lg text-sidebar-foreground'>Admin</span>
      </div>

      <nav className='flex-1 overflow-y-auto py-6'>
        <ul className='space-y-2 px-3'>
          {visibleNavItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent'}
                  `}
                >
                  <Icon className='w-5 h-5' />
                  <span className='text-sm font-medium'>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className='p-4 border-t border-sidebar-border'>
        <div className='text-xs text-sidebar-foreground/60'>© 2025 Admin</div>
      </div>
    </aside>
  )
}

export default Sidebar
