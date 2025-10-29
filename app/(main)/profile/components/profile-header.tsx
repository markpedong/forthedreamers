import { Card } from '@/components/ui/card';
import { SessionUser } from '@/lib/types';
import { FC } from 'react';
import AvatarUpload from './avatar-upload';

interface ProfileHeaderProps {
  user: SessionUser;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }: ProfileHeaderProps) => {
  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <Card className='border-0 bg-gradient-to-r from-primary/10 to-primary/5 p-6'>
      <div className='flex items-center gap-4'>
        <AvatarUpload src={user.image ?? ''} alt={user.name} initials={initials} />
        <div>
          <h1 className='text-3xl font-bold text-foreground'>{user.name}</h1>
          <p className='text-muted-foreground'>{user.email}</p>
          <div className='mt-2 flex gap-2'>
            {/* <span className='inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary'>
              {user.role}
            </span>
            {user.banned ? (
              <span className='inline-block rounded-full bg-destructive/20 px-3 py-1 text-sm font-medium text-destructive'>
                Banned
              </span>
            ) : (
              <span className='inline-block rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400'>
                Active
              </span>
            )} */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
