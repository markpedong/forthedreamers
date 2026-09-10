'use client';

import { FC, useState } from 'react';
import { Heart, LifeBuoy, LogIn, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion } from 'framer-motion';
import SearchOverlay from './search-overlay';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';
import { isDashboardRoute } from '@/constants';
import CartItemCount from './cart-item-count';
import { useAppSelector } from '@/redux/store';
import { useSignOutMutation } from '@/services/useMutation';

const Navbar: FC = () => {
  const signOutMutation = useSignOutMutation();
  const user = useAppSelector(state => state.userData.data);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isDashboardRoute(pathname)) return null;

  const CartButton = (
    <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors">
      <ShoppingCart className="w-5 h-5" />
      <CartItemCount />
    </Link>
  );

  const ProfileButton = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist"><Heart className="h-4 w-4" /> Wishlist</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support"><LifeBuoy className="h-4 w-4" /> Support</Link>
        </DropdownMenuItem>
        {pathname !== '/profile' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOutMutation.mutate()}
              variant="destructive"
              disabled={signOutMutation.isPending}
              aria-busy={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? 'Signing out...' : 'Logout'}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const SearchBar = (
    <div className="relative max-w-md flex-1 cursor-pointer" onClick={() => setIsSearchOpen(true)}>
      <Input
        type="text"
        placeholder="Search products, categories, shops..."
        readOnly
        className="w-full cursor-pointer rounded-full border-0 bg-muted py-2 pl-10 pr-4 focus-visible:ring-2 focus-visible:ring-primary"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
          }
        )}
      >
        <div
          className={classNames('w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4', {
            'gap-4': isMobile,
          })}
        >
          <Link href="/" className="font-bold text-primary">
            FTD
          </Link>
          {!isMobile && (
            <>
              {SearchBar}
              <div className="flex items-center gap-2">
                {!!user ? (
                  <>
                    {CartButton}
                    {ProfileButton}
                  </>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">
                      Sign In
                      <LogIn />
                    </Link>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
