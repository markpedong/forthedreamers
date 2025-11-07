import { getSession } from '@/lib/server-actions';
import { redirect } from 'next/navigation';
import AdminHeader from './components/admin-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dynamic';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!['ADMIN', 'SELLER'].includes(session?.user.role ?? '')) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      <div className='flex h-screen bg-background w-full'>
        <AdminSidebar session={session} />
        <div className='flex-1 flex flex-col'>
          <AdminHeader />
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
