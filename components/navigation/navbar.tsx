'use client';

import React from 'react';

import type { ReactElement } from 'react';

import { useState } from 'react';
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

export function Navbar(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className='hidden md:flex sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'
      >
        <div className='w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4'>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex-shrink-0'
          >
            <div className='text-2xl font-bold text-primary'>Shopee</div>
          </motion.div>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className='flex-1 max-w-md'>
            <div className='relative cursor-pointer' onClick={handleSearchClick}>
              <Input
                type='text'
                placeholder='Search products, categories, shops...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                readOnly
                className='w-full pl-10 pr-4 py-2 rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer'
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            </div>
          </form>

          {/* Right Actions */}
          <div className='flex items-center gap-2'>
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant='ghost' size='icon' className='relative'>
                <ShoppingCart className='w-5 h-5' />
                <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  0
                </span>
              </Button>
            </motion.div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <User className='w-5 h-5' />
                </Button>
              </motion.div>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuItem>
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>My Purchases</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <span>Dark Mode</span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className='md:hidden sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'
      >
        <div className='px-4 py-3 flex items-center justify-between gap-2'>
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className='text-xl font-bold text-primary'>Shopee</div>
          </motion.div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className='flex-1 mx-2'>
            <div className='relative cursor-pointer' onClick={handleSearchClick}>
              <Input
                type='text'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                readOnly
                className='w-full pl-8 pr-3 py-1.5 text-sm rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer'
              />
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            </div>
          </form>

          {/* Cart Icon */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant='ghost' size='icon' className='relative'>
              <ShoppingCart className='w-5 h-5' />
              <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                0
              </span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href='/profile'>
              <Button variant='ghost' size='icon'>
                <User className='w-5 h-5' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
