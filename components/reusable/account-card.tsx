'use client';

import { FC } from 'react';
import { Button } from '@/components/ui/button';
import type { Account as AccountType } from '@/lib/types';
import { OAUTH_PROVIDER_DETAILS } from '@/constants';

type AccountCardProps = {
  provider: string;
  account: AccountType | null;
  loading?: boolean;
  onClick: (provider: string) => void;
};

const AccountCard: FC<AccountCardProps> = ({ provider, account, loading, onClick }) => {
  const providerDetails = OAUTH_PROVIDER_DETAILS[provider as keyof typeof OAUTH_PROVIDER_DETAILS];
  const Icon = providerDetails?.Icon;
  const isLinked = Boolean(account?.createdAt);

  return (
    <div className='flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:bg-muted'>
      <div className='flex items-center gap-3'>
        <div className='rounded-lg bg-background p-2'>
          {Icon && <Icon className='h-5 w-5 text-foreground' />}
        </div>
        <div>
          <p className='font-medium text-foreground capitalize'>
            {providerDetails?.name ?? provider}
          </p>

          {isLinked ? (
            <>
              {account?.createdAt && (
                <p className='text-xs text-muted-foreground'>
                  Linked on{' '}
                  {new Date(account.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </>
          ) : (
            <p className='text-sm text-muted-foreground'>Not connected</p>
          )}
        </div>
      </div>

      <Button
        variant={isLinked ? 'destructive' : 'outline'}
        size='sm'
        onClick={() => onClick(provider)}
        disabled={loading}
      >
        {isLinked ? 'Unlink' : 'Link'}
      </Button>
    </div>
  );
};

export default AccountCard;
