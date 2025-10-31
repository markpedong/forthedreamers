import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

type TBackUpCodeStep = { step: 'backup-codes' | 'backup-codes-regenerated'; backupCodes: string[] };

const BackupCodesStep: FC<TBackUpCodeStep> = ({ step, backupCodes }) => (
  <>
    <motion.div
      key={step}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='flex flex-col items-center gap-3 pt-8'
    >
      <div className='h-20 w-20 rounded-full bg-green-100 flex items-center justify-center'>
        <Check className='h-10 w-10 text-green-600' />
      </div>
      <p className='text-lg text-center font-semibold text-green-600'>
        {step === 'backup-codes' ? 'Verification successful!' : 'New backup codes generated!'}
      </p>
      <p className='text-sm text-center text-muted-foreground'>
        {step === 'backup-codes'
          ? 'Your authenticator is now linked.'
          : 'Your old codes are invalid. Each new code can only be used once.'}
      </p>
    </motion.div>

    <div className='w-full mt-6 space-y-3'>
      <div className='flex gap-3 items-center'>
        <p className='text-sm font-medium text-foreground'>Backup Codes</p>
        <TwoFactorCopyAll textToCopy={backupCodes.join('\n')} />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {backupCodes.map((code) => (
          <BackupCodeButton key={code} code={code} />
        ))}
      </div>
      <div className='rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2'>
        <AlertCircle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
        <p className='text-xs text-amber-800'>
          Save these codes safely. Each can only be used once.
        </p>
      </div>
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
