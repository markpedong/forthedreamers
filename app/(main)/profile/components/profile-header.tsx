'use client';

import type { FC } from 'react';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SessionUser } from '@/lib/types';
import { signOut } from '@/lib/server-actions';
import AvatarUpload from './avatar-upload';
import { LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  user: SessionUser;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user }) => {
  const initials =
    user.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  const userRole = (user as any)?.role || 'User';

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
          {/* Avatar and user info section */}
          <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
            <AvatarUpload src={user.image ?? ''} alt={user.name} initials={initials} />
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1'>
                Signed in as
              </p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-1'>
                <CardTitle className='text-lg sm:text-2xl truncate'>{user.name}</CardTitle>
                <Badge variant='secondary' className='text-xs font-medium w-fit'>
                  {userRole}
                </Badge>
              </div>
              <CardDescription className='truncate text-sm'>{user.email}</CardDescription>
            </div>
          </div>

          {/* Logout button - full width on mobile, fixed on larger screens */}
          <CardAction className='mt-2 md:mt-0 w-full md:w-auto'>
            <Button
              variant='outline'
              size='sm'
              onClick={signOut}
              className='w-full md:w-auto gap-2 whitespace-nowrap bg-transparent'
            >
              <LogOut className='h-4 w-4' /> Logout
            </Button>
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
