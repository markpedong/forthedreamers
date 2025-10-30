import { Session } from 'better-auth';
import { Badge } from '../ui/badge';
import { getDeviceIcon } from './helpers';
import { getBrowserInfo } from '@/lib/utils';
import { Button } from '../ui/button';
import { FC, useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { revokeSession } from '@/lib/server-actions';

type Props = {
  session: Session;
  isCurrent?: boolean;
};

const SessionItem: FC<Props> = ({ session, isCurrent }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    startTransition(async () => {
      try {
        await revokeSession({ token: session.token });
        toast.success('Success', { description: `Revoked session successfully.` });
        router.refresh();
      } catch {
        toast.error('Error', { description: `Failed to revoked session.` });
      }
    });
  };

  return (
    <div
      className={`relative flex items-center justify-between rounded-lg border p-4 transition-colors ${
        isCurrent ? 'border-2 border-primary bg-primary/5' : 'bg-card hover:bg-accent/50'
      }`}
    >
      {isCurrent && (
        <Badge variant='default' className='absolute top-2 right-2 text-xs'>
          Active Now
        </Badge>
      )}

      <div className='flex items-center gap-3 flex-1'>
        <div className={`rounded-lg p-2 ${isCurrent ? 'bg-primary/10' : 'bg-muted'}`}>
          {getDeviceIcon(`${session.userAgent}`)}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-sm'>{getBrowserInfo(`${session.userAgent}`)}</p>
          <p className='text-xs text-muted-foreground'>{session.ipAddress || 'Unknown IP'}</p>
          <p className='text-xs text-muted-foreground'>
            {new Date(session.createdAt).toLocaleDateString()}{' '}
            {isCurrent && `• ${new Date(session.createdAt).toLocaleTimeString()}`}
          </p>
        </div>
      </div>

      {!isCurrent && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => handleAction()}
          disabled={isPending}
          className='ml-2 text-destructive hover:text-destructive hover:bg-destructive/10'
        >
          <LogOut className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
};

export default SessionItem;
