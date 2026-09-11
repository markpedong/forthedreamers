'use client';

import { Button } from '@/components/ui/button';
import { Button as LoadingButton } from '@/components/reusable/button';
import AvatarUpload from './avatar-upload';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { useSignOutMutation } from '@/services/useMutation';

const isGoogleImage = (url: string | null | undefined) =>
  url?.includes('googleusercontent.com') || url?.includes('ggpht.com') || false;

const ProfileHeader = () => {
  const user = useAppSelector(state => state.userData.data);
  const router = useRouter();
  const signOutMutation = useSignOutMutation();

  const initials =
    user?.displayName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex min-w-0 items-center gap-3.5 sm:gap-5">
          <AvatarUpload
            src={user?.image ?? ''}
            alt={user?.displayName ?? 'Profile avatar'}
            initials={initials}
            isGoogleAvatar={isGoogleImage(user?.image)}
          />

          <div className="min-w-0">
            <div className="mt-1 sm:mt-2">
              <h1 className="truncate text-lg font-medium tracking-tight text-foreground sm:text-2xl">
                {user?.displayName || 'Your profile'}
              </h1>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">@{user?.username}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">{user?.email}</p>
            {user?.createdAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Member since{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {['ADMIN', 'SELLER'].includes(`${user?.role}`) && (
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
              <LayoutDashboard className="h-4 w-4" /> {`${user?.role}`} access
            </Button>
          )}
          <LoadingButton
            variant="destructive"
            size="sm"
            onClick={() => signOutMutation.mutate()}
            loading={signOutMutation.isPending}
            icon={<LogOut className="h-4 w-4" />}
            title="Sign out"
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
