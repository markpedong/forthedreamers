'use client';

import { useAppSelector } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { HatGlasses } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const ImpersonationIndicator: FC = () => {
  const router = useRouter();

  // Impersonation is handled server-side; no client-side session needed.
  // This component stays as a placeholder for future server-side integration.
  const handleStopImpersonating = async () => {
    router.push('/users');
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-15 right-5 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md border border-border bg-background hover:bg-accent"
          onClick={handleStopImpersonating}
        >
          <HatGlasses />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImpersonationIndicator;
