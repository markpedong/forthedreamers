import { getSession, listAllSessions } from '@/lib/services/auth';
import { getUserAccounts, getUserAddresses } from '@/lib/services/profile';
import ProfileDetails from './components/profile-details';
import AccountManagement from './components/account-management';
import ProfileHeader from './components/profile-header';
import SessionManagement from './components/session-management';
import AddressesSection from './components/addresses-section';
import ProfileTabs from './components/profile-tabs';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/services/types';

export const metadata = {
  title: 'Profile',
  description: 'Manage your account settings and preferences',
};

type ProfilePageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  const session = await getSession();
  const userId = session?.user?.id;
  const { tab } = await searchParams;

  if (!userId) {
    return (
      <main className="min-h-[60vh]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Please sign in to view your profile.
          </div>
        </div>
      </main>
    );
  }

  const [accounts, sessions, addresses] = await Promise.all([
    getUserAccounts(userId),
    listAllSessions(),
    getUserAddresses(userId),
  ]);

  const nonCredentialAccounts = accounts.filter(a => a.providerId !== 'credential');

  const initialTab: ProfileTab | undefined =
    tab === 'security' || tab === 'addresses' || tab === 'profile' ? tab : undefined;

  return (
    <main className="min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-12">
        <ProfileHeader />

        <ProfileTabs initialTab={initialTab}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg p-1">
            <TabsTrigger value="profile" className="min-h-10 flex-none px-4">
              Personal info
            </TabsTrigger>
            <TabsTrigger value="addresses" className="min-h-10 flex-none px-4">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="security" className="min-h-10 flex-none px-4">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileDetails />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressesSection addresses={addresses} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <AccountManagement accounts={nonCredentialAccounts} hasPassword={session.hasPassword} />
              <SessionManagement currentSessionToken={session.session.token} sessions={sessions} />
            </div>
          </TabsContent>
        </ProfileTabs>
      </div>
    </main>
  );
};

export default ProfilePage;
