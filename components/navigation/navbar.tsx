'use client';

import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
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

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

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
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button variant='ghost' size='icon'>
          <User className='w-5 h-5' />
        </Button>
      </motion.div>
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>
              {isMobile ? 'Shopee' : 'FTD'}
            </div>
          </motion.div>
          {SearchBar}
          <div className='flex items-center gap-2'>
            {CartButton}
            {ProfileButton}
          </div>
        </div>
      </motion.nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
