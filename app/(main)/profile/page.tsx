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
import { getSession, listUserAccounts } from '@/lib/server-actions';
import ProfileDetails from './components/profile-details';
import ProfileLayout from './components/profile-layout';
import AccountManagement from './components/account-management';
import ClientOnly from '@/components/provider/client-only';

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences',
};

const ProfilePage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const accounts = (await listUserAccounts()).filter((a) => a.providerId !== 'credential');

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
      content: <AccountManagement user={session.user} accounts={accounts} />,
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
    },
    {
      id: '2fa',
      label: '2FA',
      icon: <Shield className='h-4 w-4' />,
    },
  ];

  return (
    <main className='min-h-screen bg-background dark'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* <ProfileHeader user={session.user} /> */}

        <div className='mt-8'>
          <ClientOnly>
            <ProfileLayout sections={sections} />
          </ClientOnly>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
