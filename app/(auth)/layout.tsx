import type { Metadata } from 'next'
import { getSession } from '@/lib/server-actions'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: {
    template: '%s | For The Dreamers',
    absolute: 'For The Dreamers'
  },
  description: 'Curated finds, secure checkout.'
}

export default async function AuthLayout({children}: LayoutProps<'/'>) {
  const session = await getSession()

  if (!!session) {
    redirect('/profile')
    return
  }

  return children
}
