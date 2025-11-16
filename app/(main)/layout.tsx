import { getSession } from '@/lib/server-actions'
import { redirect } from 'next/navigation'

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const session = await getSession()

  if (!session) {
    redirect('/sign-in?isSignedIn=false')
    return
  }

  return children
}
