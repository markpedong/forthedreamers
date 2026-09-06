import {USER_ROLE} from '@/generated/prisma'
import {getSession} from '@/lib/server-actions'
import {getAdminDashboardData, getDashboardRange, getSellerDashboardData} from '@/lib/services/dashboard'
import {redirect} from 'next/navigation'
import DashboardView from './dashboard-view'

export const dynamic = 'force-dynamic'

type DashboardPageProps = {
  searchParams: Promise<{range?: string}>
}

const DashboardPage = async ({searchParams}: DashboardPageProps) => {
  const session = await getSession()

  if (!session) redirect('/sign-in?isSignedIn=false')
  if (!session.user.emailVerified) redirect('/profile?emailVerified=false')

  const {range} = await searchParams
  const selectedRange = getDashboardRange(range)

  if (session.user.role === USER_ROLE.ADMIN) {
    return <DashboardView data={await getAdminDashboardData(selectedRange)} />
  }

  if (session.user.role === USER_ROLE.SELLER) {
    return <DashboardView data={await getSellerDashboardData(selectedRange)} />
  }

  redirect('/')
}

export default DashboardPage
