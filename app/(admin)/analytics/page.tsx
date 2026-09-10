import { USER_ROLE } from '@/generated/prisma';
import { getSessionUser } from '@/lib/auth';
import { getAdminDashboardData, getDashboardRange, getSellerDashboardData } from '@/lib/services/dashboard';
import { redirect } from 'next/navigation';
import AnalyticsView from './analytics-view';

export const dynamic = 'force-dynamic';

type AnalyticsPageProps = {
  searchParams: Promise<{ range?: string }>;
};

const AnalyticsPage = async ({ searchParams }: AnalyticsPageProps) => {
  const user = await getSessionUser();

  if (!user) redirect('/sign-in?isSignedIn=false');
  if (!user.emailVerified) redirect('/profile?emailVerified=false');

  const { range } = await searchParams;
  const selectedRange = getDashboardRange(range);

  if (user.role === USER_ROLE.ADMIN) {
    return <AnalyticsView data={await getAdminDashboardData(selectedRange)} />;
  }

  if (user.role === USER_ROLE.SELLER) {
    return <AnalyticsView data={await getSellerDashboardData(selectedRange)} />;
  }

  redirect('/');
};

export default AnalyticsPage;
