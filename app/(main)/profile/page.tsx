import { redirect } from 'next/navigation';
import { User } from 'lucide-react';
import { getSession } from '@/lib/server-actions';
import ProfileDetails from './components/profile-details';
import ProfileHeader from './components/profile-header';

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
  ];

  return (
    <main className='min-h-screen bg-background dark'>
      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
        <ProfileHeader user={session.user} />

        <div className='mt-8'>
          {/* <ProfileLayout sections={sections} children={null} /> */}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
