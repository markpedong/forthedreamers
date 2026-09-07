'use client';

import { FC, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import SessionItem from '@/components/reusable/session-item';

interface SessionsSectionProps {
  sessions: Session[];
  currentSessionToken?: string;
}

type Session = {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date | string;
};

const SessionManagement: FC<SessionsSectionProps> = ({ sessions, currentSessionToken }) => {
  const [isPending, startTransition] = useTransition();
  const currentSession = sessions.find((s) => s.token === currentSessionToken);
  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);

  const handleAction = () => {
    startTransition(async () => {
      toast.info('Session revocation is not available yet');
    });
  };

  if (!sessions.length) {
    return (
      <Card className='shadow-none'>
        <CardHeader className='border-b'>
          <CardTitle className='text-xl'>Active sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className='text-center py-8 text-muted-foreground'>
          No active sessions
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-none'>
      <CardHeader className='border-b'>
        <CardTitle className='text-xl'>Active sessions</CardTitle>
        <CardDescription>Devices currently signed in to your account.</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {currentSession && (
          <div>
            <h3 className='text-sm font-semibold text-muted-foreground mb-3'>Current Session</h3>
            <SessionItem session={currentSession} isCurrent />
          </div>
        )}

        {otherSessions.length > 0 && (
          <>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-muted-foreground'>Other Sessions</h3>
              <Button
                variant='outline'
                size='sm'
                onClick={handleAction}
                disabled={isPending}
                className='text-xs bg-transparent'
              >
                <LogOut className='w-3 h-3 mr-1' />
                Revoke All
              </Button>
            </div>

            <div className='space-y-2'>
              {otherSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
