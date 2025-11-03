'use client';

import React, { FC, useEffect, useState } from 'react';
import { LogIn, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SearchOverlay } from './search-overlay';
import { Session } from '@/lib/types';
import { useRouter } from 'next/navigation';

const Navbar: FC<{ session: Session }> = ({ session }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => setIsSearchOpen(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const CartButton = (
    <Button variant='ghost' size='icon' className='relative'>
      <ShoppingCart className='w-5 h-5' />
      <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
        0
      </span>
    </Button>
  );

  const ProfileButton = isMobile ? (
    <Link href='/profile'>
      <Button variant='ghost' size='icon'>
        <User className='w-5 h-5' />
      </Button>
    </Link>
  ) : (
    <DropdownMenu>
      <Button variant='ghost' size='icon'>
        <User className='w-5 h-5' />
      </Button>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem>My Account</DropdownMenuItem>
        <DropdownMenuItem>My Purchases</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          Dark Mode
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SearchBar = (
    <form onSubmit={handleSearch} className={`${isMobile ? 'flex-1 mx-2' : 'flex-1 max-w-md'}`}>
      <div className='relative cursor-pointer' onClick={handleSearchClick}>
        <Input
          type='text'
          placeholder={isMobile ? 'Search...' : 'Search products, categories, shops...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={handleSearchClick}
          readOnly
          className={`w-full rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer 
            ${isMobile ? 'pl-8 pr-3 py-1.5 text-sm' : 'pl-10 pr-4 py-2'}`}
        />
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground 
            ${isMobile ? 'left-2.5 w-4 h-4' : 'left-3 w-4 h-4'}`}
        />
      </div>
    </form>
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
          className={`w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 ${
            isMobile ? '' : 'gap-4'
          }`}
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
