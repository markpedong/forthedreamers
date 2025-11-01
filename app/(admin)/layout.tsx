import { getSession, permissionListUsers } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import AdminSidebar from './components/sidebar';
import Header from './components/header';
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
      <div className='flex h-screen bg-background'>
        <AdminSidebar />

        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header />

          <main className='flex-1 overflow-auto'>
            <div className='p-6'>{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
