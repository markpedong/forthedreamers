'use client';

import { useState } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import useWithDispatch from '@/hooks/useWithDispatch';
import { useAppSelector } from '@/redux/store';
import { toast } from 'sonner';
import DropDown from '@/components/reusable/dropdown';

const Topbar = () => {
  const session = useAppSelector((state) => state.appData.session);
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useWithDispatch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      console.log('[v0] Searching for:', query);
    }
  };

  const dropdownMenu = [
    {
      label: (
        <div className='flex items-center gap-3 p-3'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={session?.user.image || ''} />
            <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium'>{session?.user.name}</p>
            <p className='text-xs text-muted-foreground'>{session?.user.email}</p>
          </div>
        </div>
      ),
      className: 'w-56',
      hasSeparatorBelow: true,
    },
    {
      label: (
        <div>
          <Settings className='w-4 h-4 mr-2' />
          Profile Settings
        </div>
      ),
      onClick: () => toast.info('Profile Settings clicked', { duration: 2000 }),
      hasSeparatorBelow: true,
    },
    {
      label: (
        <div>
          <LogOut className='w-4 h-4 mr-2' />
          Sign Out
        </div>
      ),
      onClick: async () => await signOut(),
    },
  ];

  return (
    <header className='h-16 border-b border-border bg-card flex items-center justify-between px-6'>
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

      <div className='flex items-center gap-4 ml-6'>
        <Button
          variant='ghost'
          size='icon'
          className='relative'
          onClick={() => toast.info('You have 3 new notifications', { duration: 3000 })}
        >
          <Bell className='w-5 h-5' />
          <span className='absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full' />
        </Button>
        <DropDown
          trigger={
            <Button variant='ghost' className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={session?.user.image || ''} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className='hidden sm:block text-left'>
                <p className='text-sm font-medium'>{session?.user.name}</p>
                <p className='text-xs text-muted-foreground'>{session?.user.role}</p>
              </div>
            </Button>
          }
          menus={dropdownMenu}
        />
      </div>
    </header>
  );
};

export default Topbar;
