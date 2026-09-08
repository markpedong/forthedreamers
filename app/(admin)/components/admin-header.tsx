'use client';

import { FC } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { clearUserData } from '@/redux/reducers/userData';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';

const AdminHeader: FC = () => {
  const router = useRouter();
  const user = useAppSelector(state => state.userData.data);
  const pathname = usePathname();

  const handleSignOut = async () => {
    (store.dispatch as any)(clearUserData());
    try {
      await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Error signing out:', err);
    }
    router.replace('/sign-in');
  };

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
          onClick={() => void handleSignOut()}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-primary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
