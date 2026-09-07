'use client'

import { FC, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AvatarUpload from './avatar-upload'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthSession } from '@/lib/supabase/auth-context'

const isGoogleImage = (url: string | null | undefined) =>
  url?.includes('googleusercontent.com') || url?.includes('ggpht.com') || false

const ProfileHeader: FC = () => {
  const { session, signOut } = useAuthSession()
  const user = session?.user
  const router = useRouter()
  const [isGoogleAvatar, setIsGoogleAvatar] = useState(false)

  useEffect(() => {
    setIsGoogleAvatar(isGoogleImage(user?.image))
  }, [user?.image])

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
          {/* Avatar and user info section */}
          <div className='flex items-start gap-3 sm:gap-4 flex-1 min-w-0'>
            <AvatarUpload
              src={user?.image ?? ''}
              alt={`${user?.name}`}
              initials={initials}
              isGoogleAvatar={isGoogleAvatar}
            />
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1'>
                Signed in as
              </p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-1'>
                <CardTitle className='text-lg sm:text-2xl truncate'>{user?.name}</CardTitle>
                <Badge variant='secondary' className='text-xs font-medium w-fit'>
                  {user?.role}
                </Badge>
              </div>
              <CardDescription className='truncate text-sm'>{user?.email}</CardDescription>
              {user?.createdAt && (
                <p className='text-xs text-muted-foreground mt-1'>
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Logout button - full width on mobile, fixed on larger screens */}
          <CardAction className='mt-2 md:mt-0 w-full md:w-auto flex flex-col gap-3 h-full'>
            {['ADMIN', 'SELLER'].includes(`${user?.role}`) && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/dashboard')}
                className='w-full md:w-auto gap-2 whitespace-nowrap bg-transparent'
              >
                <LayoutDashboard className='h-4 w-4' /> {`${user?.role}`} Access
              </Button>
            )}
            <Button
              variant='destructive'
              size='sm'
              onClick={() => void signOut()}
              className='w-full md:w-auto gap-2 whitespace-nowrap bg-transparent'
            >
              <LogOut className='h-4 w-4' /> Logout
            </Button>
          </CardAction>
        </div>
      </CardHeader>
    </Card>
  )
}

export default ProfileHeader
