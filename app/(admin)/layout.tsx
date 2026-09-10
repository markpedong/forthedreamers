import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminHeader from './components/admin-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dynamic';

export default async function AdminLayout({ children }: LayoutProps<'/'>) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/sign-in?isSignedIn=false');
  }

  if (!user.emailVerified) {
    redirect('/profile?emailVerified=false');
  }

  if (!['ADMIN', 'SELLER'].includes(user.role ?? '')) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
