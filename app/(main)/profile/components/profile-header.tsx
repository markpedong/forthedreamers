'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AvatarUpload from './avatar-upload'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuthSession } from '@/lib/supabase/auth-context'

const isGoogleImage = (url: string | null | undefined) =>
  url?.includes('googleusercontent.com') || url?.includes('ggpht.com') || false

const ProfileHeader = () => {
  const { session, signOut } = useAuthSession()
  const user = session?.user
  const router = useRouter()

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'

  return (
    <section className='rounded-lg border border-border bg-card p-6 sm:p-8'>
      <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex min-w-0 items-center gap-4 sm:gap-5'>
          <AvatarUpload
            src={user?.image ?? ''}
            alt={user?.name ?? 'Profile avatar'}
            initials={initials}
            isGoogleAvatar={isGoogleImage(user?.image)}
          />

          <div className='min-w-0'>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              <h1 className='truncate text-xl font-medium tracking-tight text-foreground sm:text-2xl'>
                {user?.name || 'Your profile'}
              </h1>
              {user?.role && <Badge variant='secondary'>{user.role}</Badge>}
            </div>
            <p className='mt-1 truncate text-sm text-muted-foreground'>{user?.email}</p>
            {user?.createdAt && (
              <p className='mt-1 text-xs text-muted-foreground'>
                Member since{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
          {['ADMIN', 'SELLER'].includes(`${user?.role}`) && (
            <Button variant='outline' size='sm' onClick={() => router.push('/dashboard')}>
              <LayoutDashboard className='h-4 w-4' /> {`${user?.role}`} access
            </Button>
          )}
          <Button variant='destructive' size='sm' onClick={() => void signOut()}>
            <LogOut className='h-4 w-4' /> Sign out
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ProfileHeader
