import { getSession, permissionListUsers } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/admin-sidebar';
import AdminHeader from './components/admin-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { USER_ROLE } from '@/generated/prisma';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session?.user.role !== USER_ROLE.ADMIN) {
    redirect('/');
  }

  if (!(await permissionListUsers()).success) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen bg-background w-full'>
        <AdminSidebar />
        <div className='flex-1 flex flex-col'>
          <AdminHeader />
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
