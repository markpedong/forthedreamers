import { getSession } from '@/lib/server-actions'
import { redirect } from 'next/navigation'

export default async function MainLayout({children}: LayoutProps<'/'>) {
  const session = await getSession()

  if (!session) {
    redirect('/sign-in?isSignedIn=false')
    return
  }

  const authSession = {
    user: { ...session.user, email: session.user.email ?? null },
    session: session.session,
  }

  return (
    <>
      {children}
    </>
  )
}
