import {
  CreditCard,
  Heart,
  MapPin,
  Package,
  Settings,
  Shield,
  Smartphone,
  User,
  BarChart3
} from 'lucide-react'
import { getSession, listAllSessions, getUserAccounts, getUserPasskeys, getUserAddresses, getUserStats } from '@/lib/server-actions'
import ProfileDetails from './components/profile-details'
import ProfileLayout from './components/profile-layout'
import AccountManagement from './components/account-management'
import ClientOnly from '@/components/provider/client-only'
import ProfileHeader from './components/profile-header'
import SessionManagement from './components/session-management'
import TwoFactorSection from './components/2fa'
import PasskeysSection from './components/passkey-section'
import DeleteAccount from './components/delete-account'
import AddressesSection from './components/addresses-section'
import AccountStats from './components/account-stats'

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences'
}

const ProfilePage = async () => {
  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <main className='bg-background'>
        <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
          <ProfileHeader />
          <div className='mt-8 text-center text-muted-foreground'>
            <p>Please sign in to view your profile.</p>
          </div>
        </div>
      </main>
    )
  }

  const [accounts, sessions, passkeys, addresses, stats] = await Promise.all([
    getUserAccounts(userId),
    listAllSessions(),
    getUserPasskeys(userId),
    getUserAddresses(userId),
    getUserStats(userId)
  ])

  const nonCredentialAccounts = accounts.filter((a) => a.providerId !== 'credential')
  const hasPassword = accounts.some((a) => a.providerId === 'credential')

  // Map passkeys to expected type (createdAt might be null from DB)
  const mappedPasskeys = passkeys.map((pk) => ({
    ...pk,
    createdAt: pk.createdAt ?? new Date()
  }))

  const sections = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className='h-4 w-4' />,
      content: <ProfileDetails />
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Settings className='h-4 w-4' />,
      content: <AccountManagement accounts={nonCredentialAccounts} hasPassword={hasPassword} />
    },
    {
      id: 'stats',
      label: 'Overview',
      icon: <BarChart3 className='h-4 w-4' />,
      content: <AccountStats stats={stats} />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package className='h-4 w-4' />
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: <MapPin className='h-4 w-4' />,
      content: <AddressesSection addresses={addresses} />
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className='h-4 w-4' />
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <Heart className='h-4 w-4' />
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: <Smartphone className='h-4 w-4' />,
      content: (
        <SessionManagement currentSessionToken={session?.session.token} sessions={sessions} />
      )
    },
    {
      id: '2fa',
      label: 'Security',
      icon: <Shield className='h-4 w-4' />,
      content: (
        <div className='space-y-8'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Security Settings</h1>
            <p className='text-muted-foreground mt-2'>
              Manage your account security and authentication methods
            </p>
          </div>

          <TwoFactorSection />
          <PasskeysSection passkeys={mappedPasskeys} />
          <DeleteAccount />
        </div>
      )
    }
  ]

  return (
    <main className='bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <ProfileHeader />
        <ClientOnly>
          <ProfileLayout sections={sections} hasPassword={hasPassword} />
        </ClientOnly>
      </div>
    </main>
  )
}

export default ProfilePage
