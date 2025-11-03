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
import SearchOverlay from './search-overlay';
import { Session } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { signOut } from '@/lib/server-actions';
import Link from 'next/link';

const Navbar: FC<{ session: Session }> = ({ session }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  if (['/sign-in', '/reset-password'].includes(pathname)) return null;

  const CartButton = (
    <Button variant='ghost' size='icon' className='relative'>
      <ShoppingCart className='w-5 h-5' />
      <span className='absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center'>
        0
      </span>
    </Button>
  );

  const ProfileButton = !isMobile && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <User className='w-5 h-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem className='cursor-pointer' onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>Orders</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={signOut} variant='destructive'>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SearchBar = (
    <div
      className={classNames('relative cursor-pointer flex-1 max-w-md', {
        'flex-1 mx-2': isMobile,
      })}
      onClick={() => setIsSearchOpen(true)}
    >
      <Input
        type='text'
        placeholder='Search products, categories, shops...'
        readOnly
        className={classNames(
          'w-full rounded-full bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary cursor-pointer pl-10 pr-4 py-2',
          {
            'pl-8 pr-3 py-1.5 text-sm': isMobile,
          },
        )}
      />
      <Search
        className={classNames(
          'absolute top-1/2 -translate-y-1/2 text-muted-foreground left-3 w-4 h-4',
          {
            'left-2.5 w-4 h-4': isMobile,
          },
        )}
      />
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={classNames(
          'sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border',
          {
            'md:hidden': isMobile,
          },
        )}
      >
        <div
          className={classNames(
            'w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4',
            {
              'gap-4': isMobile,
            },
          )}
        >
          <Link href='/' className='font-bold text-primary'>
            FTD
          </Link>
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
