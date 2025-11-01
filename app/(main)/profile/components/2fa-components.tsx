import { FC, useState } from 'react';
import { Check, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

type TBackUpCodeStep = { step: 'backup-codes' | 'backup-codes-regenerated'; backupCodes: string[] };

const BackupCodesStep: FC<TBackUpCodeStep> = ({ step, backupCodes }) => (
  <>
    <div className='flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 my-6'>
      <CheckCircle2 className='h-5 w-5 text-green-600 flex-shrink-0' />
      <p className='text-sm text-green-800'>Two-factor authentication enabled successfully!</p>
    </div>

    <div className='w-full space-y-3'>
      <div className='flex gap-3 items-center'>
        <p className='text-sm font-medium text-foreground'>Backup Codes</p>
        <TwoFactorCopyAll textToCopy={backupCodes.join('\n')} />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {backupCodes.map((code) => (
          <BackupCodeButton key={code} code={code} />
        ))}
      </div>
      <p className='text-xs text-muted-foreground'>
        Store these codes in a secure place. Each code can be used once if you lose access to your
        authenticator app.
      </p>
    </div>
  </>
);

const BackupCodeButton: FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <button
      onClick={handleCopy}
      className='flex items-center justify-between rounded-lg border border-border bg-muted p-2 hover:bg-muted/80 transition-colors text-left'
    >
      <span className='font-mono text-sm font-medium'>{code}</span>
      {copied ? (
        <Check className='h-4 w-4 text-green-600' />
      ) : (
        <Copy className='h-4 w-4 text-muted-foreground' />
      )}
    </button>
  );
};

const TwoFactorCopyAll: FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied all to clipboard');
    setTimeout(() => setCopied(false), 800);
  };

  return (
    <button
      onClick={handleCopy}
      className='flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors'
    >
      {copied ? (
        <Check className='h-4 w-4 text-green-600 animate-scale-in' />
      ) : (
        <Copy className='h-4 w-4' />
      )}
    </button>
  );
};

export { BackupCodesStep };
