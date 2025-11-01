import { redirect } from 'next/navigation';
import {
  CreditCard,
  Heart,
  MapPin,
  Package,
  Settings,
  Shield,
  Smartphone,
  User,
} from 'lucide-react';
import { getSession, listAllSessions, listPasskeys, listUserAccounts } from '@/lib/server-actions';
import ProfileDetails from './components/profile-details';
import ProfileLayout from './components/profile-layout';
import AccountManagement from './components/account-management';
import ClientOnly from '@/components/provider/client-only';
import ProfileHeader from './components/profile-header';
import SessionManagement from './components/session-management';
import TwoFactorSection from './components/2fa';
import PasskeysSection from './components/passkey-section';

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences',
};

const ProfilePage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const [accounts, sessions, passkeys] = await Promise.all([
    listUserAccounts(),
    listAllSessions(),
    listPasskeys(),
  ]);
  const nonCredentialAccounts = accounts.filter((a) => a.providerId !== 'credential');
  const hasPassword = accounts.some((a) => a.providerId === 'credential');

  const sections = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className='h-4 w-4' />,
      content: <ProfileDetails user={session.user} />,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Settings className='h-4 w-4' />,
      content: (
        <AccountManagement
          accounts={nonCredentialAccounts}
          hasPassword={hasPassword}
          user={session.user}
        />
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <Package className='h-4 w-4' />,
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: <MapPin className='h-4 w-4' />,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className='h-4 w-4' />,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: <Heart className='h-4 w-4' />,
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: <Smartphone className='h-4 w-4' />,
      content: (
        <SessionManagement currentSessionToken={session.session.token} sessions={sessions} />
      ),
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

          <TwoFactorSection user={session.user} />
          <PasskeysSection passkeys={passkeys} />
        </div>
      ),
    },
  ];

  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <ProfileHeader user={session.user} />
        <ClientOnly>
          <ProfileLayout sections={sections} hasPassword={hasPassword} />
        </ClientOnly>
      </div>
    </main>
  );
};

export default ProfilePage;
