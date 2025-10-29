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
import { getSession } from '@/lib/server-actions';
import ProfileDetails from './components/profile-details';
import ProfileHeader from './components/profile-header';
import ProfileLayout from './components/profile-layout';

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences',
};

const ProfilePage = async () => {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

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
        <ProfileHeader user={session.user} />

        <div className='mt-8'>
          <ProfileLayout sections={sections} children={null} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
