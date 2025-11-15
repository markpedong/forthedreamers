'use client'

import { FC } from 'react'
import { Facebook, Twitter, Instagram, Heart, Mail, MapPin, Phone } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import classNames from 'classnames'
import styles from './styles.module.scss'

const socialLinks = [
  {icon: Facebook, label: 'Facebook', href: '#'},
  {icon: Twitter, label: 'Twitter', href: '#'},
  {icon: Instagram, label: 'Instagram', href: '#'}
]

const quickLinks = ['Shop All', 'New Arrivals', 'Best Sellers', 'Special Offers']
const customerService = ['Contact Us', 'Shipping Info', 'Returns', 'FAQ']

const Footer: FC = () => {
  const year = new Date().getFullYear()
  const linkClass = 'opacity-70 hover:opacity-100 transition-opacity'
  const sectionTitle = 'font-semibold text-sm'
  const isMobile = useIsMobile()

  return (
    <div
      className={classNames('max-w-7xl mx-auto px-4 pb-12 lg:py-16', {
        [styles.isMobile]: isMobile
      })}
    >
      <div className='grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12'>
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Premium Store</h3>
          <p className='text-sm opacity-80'>Curated products for the modern lifestyle. Quality you can trust.</p>

          <div className='flex space-x-4 mt-4'>
            {socialLinks.map(({icon: Icon, href, label}) => (
              <a key={label} href={href} aria-label={label} className={linkClass}>
                <Icon className='w-5 h-5' />
              </a>
            ))}
          </div>
        </div>

        <div className='space-y-4'>
          <h4 className={sectionTitle}>Quick Links</h4>
          <ul className='space-y-2 text-sm'>
            {quickLinks.map(link => (
              <li key={link}>
                <a href='#' className={linkClass}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-4'>
          <h4 className={sectionTitle}>Customer Service</h4>
          <ul className='space-y-2 text-sm'>
            {customerService.map(item => (
              <li key={item}>
                <a href='#' className={linkClass}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className='space-y-4'>
          <h4 className={sectionTitle}>Get in Touch</h4>
          <address className='not-italic space-y-3 text-sm'>
            <a href='tel:+1234567890' className={`flex items-center gap-2 ${linkClass}`}>
              <Phone className='w-4 h-4' />
              +1 (234) 567-890
            </a>

            <a href='mailto:support@store.com' className={`flex items-center gap-2 ${linkClass}`}>
              <Mail className='w-4 h-4' />
              support@store.com
            </a>

            <div className='flex items-center gap-2 opacity-70'>
              <MapPin className='w-4 h-4' />
              123 Commerce St, City
            </div>
          </address>
        </div>
      </div>

      <div className='border-t border-background/20 pt-8 mb-8' />

      <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70'>
        <div className='flex items-center gap-1'>
          Made with <Heart className='w-3 h-3 fill-current' /> by Premium Store
        </div>

        <div className='flex gap-6'>
          <a href='#' className='hover:opacity-100 transition-opacity'>
            Privacy Policy
          </a>
          <a href='#' className='hover:opacity-100 transition-opacity'>
            Terms of Service
          </a>
          <a href='#' className='hover:opacity-100 transition-opacity'>
            Cookie Policy
          </a>
        </div>

        <p>&copy; {year} Premium Store. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer
