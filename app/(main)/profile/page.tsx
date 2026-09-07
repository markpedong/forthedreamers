import { getSession, listAllSessions, getUserAccounts, getUserAddresses, getUserStats } from '@/lib/server-actions'
import ProfileDetails from './components/profile-details'
import AccountManagement from './components/account-management'
import ProfileHeader from './components/profile-header'
import SessionManagement from './components/session-management'
import AddressesSection from './components/addresses-section'
import AccountStats from './components/account-stats'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences'
}

type ProfilePageProps = {
  searchParams: Promise<{ tab?: string }>
}

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  const session = await getSession()
  const userId = session?.user?.id
  const { tab } = await searchParams

  if (!userId) {
    return (
      <main className='min-h-screen'>
        <div className='mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8'>
          <div className='rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground'>
            Please sign in to view your profile.
          </div>
        </div>
      </main>
    )
  }

  const [accounts, sessions, addresses, stats] = await Promise.all([
    getUserAccounts(userId),
    listAllSessions(),
    getUserAddresses(userId),
    getUserStats(userId)
  ])

  const nonCredentialAccounts = accounts.filter((a) => a.providerId !== 'credential')
  const hasPassword = accounts.some((a) => a.providerId === 'credential')

  const defaultTab = tab === 'account' ? 'security' : tab

  return (
    <main className='min-h-screen'>
      <div className='mx-auto max-w-7xl space-y-16 px-4 pb-20 pt-12 sm:px-6 lg:px-8'>
        <div className='text-xs uppercase tracking-widest text-muted-foreground'>
          Account / Profile
        </div>

        <ProfileHeader />

        <Tabs
          defaultValue={['profile', 'addresses', 'security', 'overview'].includes(defaultTab ?? '') ? defaultTab : 'profile'}
          className='gap-8'
        >
          <TabsList className='h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg p-1'>
            <TabsTrigger value='profile' className='min-h-10 flex-none px-4'>
              Personal info
            </TabsTrigger>
            <TabsTrigger value='addresses' className='min-h-10 flex-none px-4'>
              Addresses
            </TabsTrigger>
            <TabsTrigger value='security' className='min-h-10 flex-none px-4'>
              Security
            </TabsTrigger>
            <TabsTrigger value='overview' className='min-h-10 flex-none px-4'>
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value='profile'>
            <ProfileDetails />
          </TabsContent>

          <TabsContent value='addresses'>
            <AddressesSection addresses={addresses} />
          </TabsContent>

          <TabsContent value='security' className='space-y-8'>
            <div className='grid items-start gap-8 lg:grid-cols-2'>
              <AccountManagement accounts={nonCredentialAccounts} hasPassword={hasPassword} />
              <SessionManagement currentSessionToken={session.session.token} sessions={sessions} />
            </div>
          </TabsContent>

          <TabsContent value='overview'>
            <AccountStats stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export default ProfilePage
