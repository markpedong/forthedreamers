'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { useSignOutMutation } from '@/services/useMutation';

const AdminHeader: FC = () => {
  const signOutMutation = useSignOutMutation();
  const user = useAppSelector(state => state.userData.data);
  const pathname = usePathname();

  return (
    <header className="h-16 border-b border-sidebar-border bg-background px-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-sidebar-foreground">
        {pathname === '/dashboard'
          ? 'Dashboard'
          : pathname.split('/').pop()?.charAt(0).toUpperCase() + pathname.split('/').slice(-1)[0].replace(/-/g, ' ') ||
            'Admin'}
      </h2>
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-sidebar-foreground/80">
            <User className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        )}
        <button
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
          aria-busy={signOutMutation.isPending}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {signOutMutation.isPending ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
