import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const Moon = dynamic(() => import('lucide-react').then((mod) => mod.Moon), {
  ssr: false,
});
const Sun = dynamic(() => import('lucide-react').then((mod) => mod.Sun), {
  ssr: false,
});

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        key={theme}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className='fixed bottom-5 right-5 z-50'
      >
        <Button
          variant='outline'
          size='icon'
          onClick={toggleTheme}
          className='rounded-full shadow-md border border-border bg-background hover:bg-accent'
        >
          {theme === 'light' ? (
            <Moon className='h-[1.2rem] w-[1.2rem]' />
          ) : (
            <Sun className='h-[1.2rem] w-[1.2rem]' />
          )}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton;
