'use client';

import { FC, useState } from 'react';
import { Heart, Home, ShoppingBag, Package, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppSelector } from '@/redux/store';
import { Route } from 'next';
import SearchOverlay from './search-overlay';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: ShoppingBag, label: 'Categories', href: '/categories' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist', protected: true },
  { icon: Package, label: 'Orders', href: '/orders', protected: true },
  { icon: User, label: 'Profile', href: '/profile' },
];

const BottomNav: FC = () => {
  const user = useAppSelector(state => state.userData.data);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  if (!isMobile) return null;

  return (
    <>
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-border/70 bg-background/95 p-1 shadow-lg backdrop-blur-md">
          {navItems
            .filter(item => !item.protected || !!user)
            .map(({ icon: Icon, label, href }) => {
              const isDisabled = href === '/categories';
              const destination = href === '/profile' && !user ? '/sign-in' : href;
              const isActive = pathname === href || (href === '/profile' && pathname === '/sign-in');
              return (
                <motion.div key={href} className="min-w-0 flex-1" whileTap={{ scale: 0.95 }}>
                  <Link
                    href={destination as Route}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : undefined}
                    onClick={event => isDisabled && event.preventDefault()}
                    className={cn(
                      'flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-1 transition-colors',
                      isDisabled
                        ? 'pointer-events-none text-muted-foreground/40'
                        : isActive
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="max-w-full truncate text-[11px] font-medium">{label}</span>
                  </Link>
                </motion.div>
              );
            })}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSearchOpen(true)}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </motion.button>
      </motion.nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default BottomNav;
