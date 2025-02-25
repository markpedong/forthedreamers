import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'

export const poppins = Poppins({ weight: ['400', '600', '800'], subsets: ['latin'] })

export const SF_PRO_DISPLAY = localFont({
  src: [
    {
      path: './sfProDisplay/SF-Pro-Display-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './sfProDisplay/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './sfProDisplay/SF-Pro-Display-Semibold.otf',
      weight: '500',
      style: 'normal',
    },
  ],
})
