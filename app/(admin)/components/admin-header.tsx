'use client';

import { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import useWithDispatch from '@/hooks/useWithDispatch';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');
  const { signOut } = useWithDispatch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      console.log('[v0] Searching for:', query);
    }
  };

  const handleNotificationClick = () => {
    showNotification('You have 3 new notifications');
  };

  const handleSettingsClick = () => {
    showNotification('Opening profile settings');
  };

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <header className='h-16 border-b border-border bg-card flex items-center justify-between px-6'>
        {/* Search Bar */}
        <div className='flex-1 max-w-md'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='Search products, users, orders...'
              className='pl-10 bg-muted'
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-4 ml-6'>
          {/* Notifications */}
          <Button
            variant='ghost'
            size='icon'
            className='relative'
            onClick={handleNotificationClick}
          >
            <Bell className='w-5 h-5' />
            <span className='absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full' />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=admin' />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className='hidden sm:block text-left'>
                  <p className='text-sm font-medium'>Admin User</p>
                  <p className='text-xs text-muted-foreground'>Super Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='flex items-center gap-3 p-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=admin' />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm font-medium'>Admin User</p>
                  <p className='text-xs text-muted-foreground'>admin@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className='w-4 h-4 mr-2' />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive' onClick={async () => await signOut()}>
                <LogOut className='w-4 h-4 mr-2' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm z-50'>
          {toast}
        </div>
      )}
    </>
  );
}
