import { FOOTER_TITLE } from '@/constants'
import { Input, Link } from '@heroui/react'
import styles from '../styles.module.scss'
import { IoSend } from 'react-icons/io5'
import { QRCode } from 'antd'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className="w-full p-6">
        <div className="grid grid-cols-5 gap-10">
          {FOOTER_TITLE?.map(w => (
            <Link className="font-bold" color="foreground" key={w} size="lg">
              {w}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-10">
          <div className="mt-4">
            <h1>Subscribe</h1>
            <div className="text-xs mt-5 mb-3">Get 10% off your first order</div>
            <Input
              endContent={<IoSend size={12} />}
              variant="bordered"
              size="sm"
              placeholder="Enter your email"
              radius="none"
            />
          </div>
          <div className="mt-4">
            <div className="text-typography-1 text-sm mb-3">111 Gentri Cavite</div>
            <div className="text-typography-1 text-sm mb-3">forthedreamers@gmail.com</div>
            <div className="text-typography-1 text-sm mb-3">+63 123 456 789</div>
          </div>
          <div className="mt-4">
            <div className="text-typography-1 text-sm mb-3">My Account</div>
            <div className="text-typography-1 text-sm mb-3">Login / Register</div>
            <div className="text-typography-1 text-sm mb-3">Cart</div>
            <div className="text-typography-1 text-sm mb-3">Wishlist</div>
            <div className="text-typography-1 text-sm mb-3">Shop</div>
          </div>
          <div className="mt-4">
            <div className="text-typography-1 text-sm mb-3">Privacy Policy</div>
            <div className="text-typography-1 text-sm mb-3">Terms of Use</div>
            <div className="text-typography-1 text-sm mb-3">FAQ</div>
            <div className="text-typography-1 text-sm mb-3">Contact</div>
          </div>
          <div className="mt-4">
            <div className="text-typography-1 text-xs mb-3">Save $3 with App, new user only</div>
            <div className="flex justify-between gap-2 mb-3">
              <QRCode value={'test'} size={75} errorLevel="M" className="footer-qr" />
              <div className="flex flex-col justify-around">
                <Image src={'/images/googleplay.png'} width={100} height={100} alt="googleplay" />
                <Image src={'/images/appstore.png'} width={100} height={100} alt="appstore" />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
