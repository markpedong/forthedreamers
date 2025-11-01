'use client';

import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  return (
    <header className='h-14 border-b border-border bg-card px-8 flex items-center justify-between'>
      <h2 className='text-sm font-medium text-foreground tracking-tight'>Admin Portal</h2>

      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' className='size-8'>
          <Bell className='size-4 text-muted-foreground' />
        </Button>

        <Button variant='ghost' size='sm' className='gap-2 text-sm font-medium'>
          <LogOut className='size-4' />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
