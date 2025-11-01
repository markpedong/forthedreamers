'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Lock, Key, FileText, Settings, Zap, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/roles', label: 'Roles', icon: Lock },
  { href: '/admin/api-keys', label: 'API Keys', icon: Key },
  { href: '/admin/logs', label: 'Audit Logs', icon: FileText },
  { href: '/admin/plugins', label: 'Plugins', icon: Zap },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='border-r border-border bg-sidebar'>
      <SidebarHeader className='border-b border-sidebar-border px-6 py-4'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary'>
            <LayoutDashboard className='h-4 w-4 text-sidebar-primary-foreground' />
          </div>
          <span className='text-lg font-bold text-sidebar-foreground'>Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-3 py-4'>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    'rounded-md px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent',
                  )}
                >
                  <Link href={item.href} className='flex items-center gap-3'>
                    <Icon className='h-4 w-4' />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='border-t border-sidebar-border p-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className='flex-1 text-left'>
                <p className='text-sm font-medium text-sidebar-foreground'>Admin User</p>
                <p className='text-xs text-muted-foreground'>admin@system.local</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuItem>
              <Settings className='h-4 w-4 mr-2' />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Lock className='h-4 w-4 mr-2' />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem className='text-destructive'>
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
