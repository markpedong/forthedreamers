'use client'

import { FC } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import Link from 'next/link'
import classNames from 'classnames'
import { Route } from 'next'

const links = {
  shop: ['New Arrivals', 'Best Sellers', 'Accessories', 'Sale'],
  support: ['FAQ', 'Shipping & Returns', 'Contact Us', 'Privacy Policy'],
  footer: ['Terms', 'Privacy', 'Cookies']
}

const socials = [
  {icon: '/images/instagram.svg', label: 'Instagram', href: '1'},
  {icon: '/images/x.svg', label: 'X', href: '2'},
  {icon: '/images/facebook.svg', label: 'Facebook', href: '3'}
]

const Footer: FC = () => {
  const isMobile = useIsMobile()

  return (
    <footer className={classNames('max-w-7xl mx-auto px-4 py-16 pb-12 lg:pb-16', isMobile && 'pb-24')}>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-16'>
        <div className='space-y-4'>
          <h4 className='text-lg font-bold uppercase tracking-tighter'>ForTheDreamers</h4>
          <p className='text-sm text-neutral-500 leading-relaxed'>
            A digital space for the modern minimalist. Curated with care, designed for life.
          </p>
        </div>

        <Section title='Shop' items={links.shop} />
        <Section title='Support' items={links.support} />

        <div>
          <h5 className='font-medium mb-4'>Connect</h5>
          <div className='flex gap-4 text-neutral-500'>
            {socials.map(({icon, label, href}) => (
              <Link key={href} href={href as Route} aria-label={label} className='hover:text-primary'>
                <span
                  aria-hidden='true'
                  className='block w-5 h-5 bg-current'
                  style={{
                    mask: `url(${icon}) center / contain no-repeat`,
                    WebkitMask: `url(${icon}) center / contain no-repeat`
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className='pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400'>
        <p>© {new Date().getFullYear()} ForTheDreamers. All rights reserved.</p>
        <div className='flex gap-6'>
          {links.footer.map(t => (
            <Link key={t} href='#' className='hover:text-primary'>
              {t}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

const Section: FC<{title: string; items: string[]}> = ({title, items}) => (
  <div>
    <h5 className='font-medium mb-4'>{title}</h5>
    <ul className='space-y-2 text-sm text-neutral-500'>
      {items.map(item => (
        <li key={item}>
          <Link href='#' className='hover:text-primary'>
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Footer
