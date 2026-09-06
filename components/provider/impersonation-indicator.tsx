'use client'

import { Button } from '@/components/ui/button';
import { useAuthSession } from '@/lib/supabase/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { HatGlasses } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const ImpersonationIndicator: FC = () => {
  const session = useAuthSession().session;
  const router = useRouter();

  // Check for impersonation (custom property from Supabase extension)
  const isImpersonated = session?.session && 'impersonatedBy' in (session.session as any);
  const impersonatedBy = isImpersonated ? (session.session as any).impersonatedBy : null;

  if (!impersonatedBy) return null;

  const handleStopImpersonating = async () => {
    router.push('/users');
  };

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className='fixed bottom-15 right-5 z-50'
      >
        <Button
          variant='outline'
          size='icon'
          className='rounded-full shadow-md border border-border bg-background hover:bg-accent'
          onClick={handleStopImpersonating}
        >
          <HatGlasses />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImpersonationIndicator;
