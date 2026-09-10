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

  const segment = pathname.split('/').filter(Boolean).pop() ?? 'dashboard';
  const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-sidebar-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h2 className="text-lg font-semibold text-sidebar-foreground">{title}</h2>
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
          className="flex items-center gap-2 text-sm text-sidebar-foreground/80 transition-colors hover:text-sidebar-primary"
        >
          <LogOut className="w-4 h-4" />
          {signOutMutation.isPending ? 'Signing out...' : 'Logout'}
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
