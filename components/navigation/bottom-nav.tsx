'use client'

import { FC } from 'react'
import { Home, ShoppingBag, Package, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useAppSelector } from '@/redux/store'
import { Route } from 'next'

const navItems = [
  {icon: Home, label: 'Home', href: '/'},
  {icon: ShoppingBag, label: 'Categories', href: '/categories'},
  {icon: Package, label: 'Orders', href: '/orders', protected: true},
  {icon: User, label: 'Profile', href: '/profile', protected: true}
]

const BottomNav: FC = () => {
  const session = useAppSelector(state => state.appData?.session)
  const pathname = usePathname()
  const isMobile = useIsMobile()
  if (!isMobile) return null

  return (
    <motion.nav initial={{y: 100}} animate={{y: 0}} transition={{duration: 0.3}} className='fixed bottom-0 left-0 right-0 z-40 md:hidden'>
      <div className='absolute inset-0 bg-background/80 backdrop-blur-md border-t border-border' />
      <div className='relative flex items-center justify-around px-2 py-3'>
        {navItems
          .filter(item => !item.protected || !!session)
          .map(({icon: Icon, label, href}) => {
            const isActive = pathname === href
            return (
              <motion.div key={href} whileHover={{scale: 1.1}} whileTap={{scale: 0.95}}>
                <Link
                  href={href as Route}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors relative',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId='activeIndicator'
                      className='absolute inset-0 bg-primary/10 rounded-lg'
                      transition={{type: 'spring', stiffness: 300, damping: 30}}
                    />
                  )}
                  <motion.div
                    animate={{scale: isActive ? 1.2 : 1}}
                    transition={{type: 'spring', stiffness: 300, damping: 30}}
                    className='relative z-10'
                  >
                    <Icon className='w-6 h-6' />
                  </motion.div>
                  <span className='text-xs font-medium relative z-10'>{label}</span>
                </Link>
              </motion.div>
            )
          })}
      </div>
    </motion.nav>
  )
}

export default BottomNav
