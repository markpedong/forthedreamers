import type { Metadata } from 'next'
import { getSession } from '@/lib/services/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: {
    template: '%s | For The Dreamers',
    absolute: 'For The Dreamers'
  },
  description: 'Curated finds, secure checkout.'
}

const AuthLayout = async ({children}: LayoutProps<'/'>) => {
  const session = await getSession()

  if (session) redirect(session.user.role === 'SELLER' || session.user.role === 'ADMIN' ? '/dashboard' : '/profile')

  return children
}

export default AuthLayout
