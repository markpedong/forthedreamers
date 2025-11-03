'use client';

import { FC, useState } from 'react';
import { LogIn, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { SearchOverlay } from './search-overlay';
import { Session } from '@/lib/types';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

const Navbar: FC<{ session: Session }> = ({ session }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  const CartButton = (
    <Button variant='ghost' size='icon' className='relative'>
      <ShoppingCart className='w-5 h-5' />
      <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
        0
      </span>
    </Button>
  );

  const ProfileButton = isMobile ? null : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <User className='w-5 h-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
        <DropdownMenuItem>Orders</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SearchBar = (
    <div
      className={`relative cursor-pointer ${isMobile ? 'flex-1 mx-2' : 'flex-1 max-w-md'}`}
      onClick={() => setIsSearchOpen(true)}
    >
      <Input
        type='text'
        placeholder={isMobile ? 'Search...' : 'Search products, categories, shops...'}
        readOnly
        className={`w-full rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer 
            ${isMobile ? 'pl-8 pr-3 py-1.5 text-sm' : 'pl-10 pr-4 py-2'}`}
      />
      <Search
        className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground 
            ${isMobile ? 'left-2.5 w-4 h-4' : 'left-3 w-4 h-4'}`}
      />
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border ${
          isMobile ? 'md:hidden' : 'hidden md:flex'
        }`}
      >
        <div
          className={classNames(
            'w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4',
            {
              'gap-4': isMobile,
            },
          )}
        >
          <div className='font-bold text-primary'>FTD</div>
          {SearchBar}
          <div className='flex items-center gap-2'>
            {!!session ? (
              <>
                {CartButton}
                {ProfileButton}
              </>
            ) : (
              <Button variant='ghost' onClick={() => router.push('/sign-in')}>
                Sign In
                <LogIn />
              </Button>
            )}
          </div>
        </div>
      </motion.nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
