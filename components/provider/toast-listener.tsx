'use client'

import { useAuthSession } from '@/lib/supabase/auth-context'
import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const ToastListener = () => {
  const { session, signOut } = useAuthSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const error = searchParams.get('error')
  const emailVerified = searchParams.get('emailVerified')
  const accountLinked = searchParams.get('accountLinked')
  const isFromSocial = searchParams.get('social')
  const isSignedIn = searchParams.get('isSignedIn')

  const deleteParameters = (keys: string[]) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString())
    keys.forEach(key => nextSearchParams.delete(key))

    const newQuery = nextSearchParams.toString()
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname

    setTimeout(() => router.replace(newUrl as Route, {scroll: false}), 100)
  }

  useEffect(() => {
    if (isSignedIn === 'false') {
      signOut()
      deleteParameters(['isSignedIn'])
    }
  }, [pathname, isSignedIn])

  useEffect(() => {
    if (isFromSocial) {
      // Refresh session from server after social login redirect
      router.refresh()
      deleteParameters(['social'])
    }
  }, [pathname, isFromSocial])

  useEffect(() => {
    if (emailVerified) {
      toast.success('Email verified successfully!', {duration: 3000})
      deleteParameters(['emailVerified'])
      return
    }

    if (accountLinked) {
      toast.success('Account linked successfully!', {duration: 3000})
      deleteParameters(['accountLinked', 'tab'])
      return
    }

    if (error) {
      toast.error(`Error: ${error}, please try again.`, {duration: 3000})
      deleteParameters(['error'])
    }
  }, [pathname, emailVerified, accountLinked, error])

  return null
}

export default ToastListener
