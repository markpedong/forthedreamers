'use client';

import { FC, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAuthSession } from '@/lib/supabase/auth-context';

const AdminHeader: FC = () => {
  const { session, signOut } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className='h-16 border-b border-sidebar-border bg-background px-6 flex items-center justify-between'>
      <h2 className='text-lg font-semibold text-sidebar-foreground'>
        {pathname === '/dashboard' ? 'Dashboard' : pathname.split('/').pop()?.charAt(0).toUpperCase() + pathname.split('/').slice(-1)[0].replace(/-/g, ' ') || 'Admin'}
      </h2>
      <div className='flex items-center gap-4'>
        {session?.user && (
          <div className='flex items-center gap-2 text-sm text-sidebar-foreground/80'>
            <User className='w-4 h-4' />
            <span>{session.user.email}</span>
          </div>
        )}
        <button
          onClick={async () => await signOut()}
          className='flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors'
        >
          <LogOut className='w-4 h-4' />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
