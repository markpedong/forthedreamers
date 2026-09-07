'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from './client'

type SessionUser = {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  role?: string | null
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type AuthSession = {
  user: SessionUser | null
  session?: { token?: string; impersonatedBy?: string | null } | null
}

type AuthContextType = {
  session: AuthSession | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthSession = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuthSession must be used within an AuthProvider')
  return context
}

type AuthProviderProps = {
  children: ReactNode
  initialSession?: AuthSession | null
}

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(initialSession ?? null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(
        currentSession ? { user: currentSession.user, session: { token: currentSession.access_token, impersonatedBy: null } } : null
      )
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    setSession(null)

    try {
      const { error } = await createSupabaseBrowserClient().auth.signOut()
      if (error) console.error('Error signing out:', error)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      router.replace('/sign-in')
    }
  }

  return <AuthContext.Provider value={{ session, signOut }}>{children}</AuthContext.Provider>
}
