import { getSession, permissionListUsers } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/admin-sidebar';
import AdminHeader from './components/admin-header';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  if (!(await permissionListUsers()).success) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen bg-background w-full'>
        <AdminSidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <AdminHeader />

          <main className='flex-1 overflow-auto'>
            <div className='p-6'>{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
