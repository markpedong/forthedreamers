import localFont from 'next/font/local'

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
