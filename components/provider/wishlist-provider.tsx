'use client'

import {createContext, useContext, useEffect, useRef, useState, type ReactNode} from 'react'
import {toast} from 'sonner'
import {setWishlist} from '@/lib/actions/wishlist'
import {useAuthSession} from '@/lib/supabase/auth-context'

type WishlistContextValue = {
  ids: string[]
  pending: boolean
  isPending: (id: string) => boolean
  toggle: (id: string) => void
}

const Context = createContext<WishlistContextValue>({
  ids: [],
  pending: false,
  isPending: () => false,
  toggle: () => undefined
})

export const WishlistProvider = ({initialIds, children}: {initialIds: string[]; children: ReactNode}) => {
  const [ids, setIds] = useState(initialIds)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const visibleIds = useRef(new Set(initialIds))
  const confirmedIds = useRef(new Set(initialIds))
  const versions = useRef(new Map<string, number>())
  const queues = useRef(new Map<string, Promise<void>>())
  const sessionGeneration = useRef(0)
  const {session} = useAuthSession()
  const userId = session?.user?.id

  useEffect(() => {
    const generation = sessionGeneration.current + 1
    sessionGeneration.current = generation
    let cancelled = false

    const reset = () => {
      setIds([])
      setPendingIds(new Set())
      visibleIds.current = new Set()
      confirmedIds.current = new Set()
      versions.current.clear()
      queues.current.clear()
    }

    if (!userId) {
      const resetTimer = setTimeout(reset, 0)
      return () => {
        cancelled = true
        clearTimeout(resetTimer)
      }
    }

    const loadIds = async () => {
      try {
        const response = await fetch('/api/wishlist?ids=true', {cache: 'no-store'})
        const result = await response.json() as {success?: boolean; data?: {ids?: string[]}}
        if (cancelled || sessionGeneration.current !== generation || !result.success || !result.data?.ids) return
        const serverIds = new Set(result.data.ids)
        for (const id of queues.current.keys()) {
          if (visibleIds.current.has(id)) serverIds.add(id)
          else serverIds.delete(id)
        }
        setIds([...serverIds])
        visibleIds.current = serverIds
        confirmedIds.current = new Set(result.data.ids)
      } catch {
        // Keep the current optimistic state when the bootstrap request is unavailable.
      }
    }

    void loadIds()
    return () => {
      cancelled = true
    }
  }, [userId])

  const toggle = (id: string) => {
    const generation = sessionGeneration.current
    const wanted = !visibleIds.current.has(id)
    const version = (versions.current.get(id) ?? 0) + 1
    versions.current.set(id, version)

    if (wanted) visibleIds.current.add(id)
    else visibleIds.current.delete(id)

    setIds(state => wanted ? [...new Set([...state, id])] : state.filter(value => value !== id))
    setPendingIds(state => new Set([...state, id]))

    const previous = queues.current.get(id) ?? Promise.resolve()
    const request = previous.catch(() => undefined).then(async () => {
      try {
        const result = await setWishlist(id, wanted)

        if (!result.success) {
          if (sessionGeneration.current === generation && versions.current.get(id) === version) {
            const wasWanted = confirmedIds.current.has(id)
            visibleIds.current[wasWanted ? 'add' : 'delete'](id)
            setIds(state => wasWanted ? [...new Set([...state, id])] : state.filter(value => value !== id))
          }
          toast.error(result.message)
          return
        }

        if (result.data.wanted) confirmedIds.current.add(id)
        else confirmedIds.current.delete(id)

        if (sessionGeneration.current === generation && versions.current.get(id) === version) {
          visibleIds.current[result.data.wanted ? 'add' : 'delete'](id)
          setIds(state => result.data.wanted ? [...new Set([...state, id])] : state.filter(value => value !== id))
          toast.success(result.message)
        }
      } catch {
        if (sessionGeneration.current === generation && versions.current.get(id) === version) {
          const wasWanted = confirmedIds.current.has(id)
          visibleIds.current[wasWanted ? 'add' : 'delete'](id)
          setIds(state => wasWanted ? [...new Set([...state, id])] : state.filter(value => value !== id))
        }
        toast.error('Unable to update wishlist')
      } finally {
        if (sessionGeneration.current === generation && versions.current.get(id) === version) {
          setPendingIds(state => {
            const next = new Set(state)
            next.delete(id)
            return next
          })
        }
      }
    })

    queues.current.set(id, request)
    request.then(() => {
      if (queues.current.get(id) === request) queues.current.delete(id)
    })
  }

  return (
    <Context.Provider value={{
      ids,
      pending: pendingIds.size > 0,
      isPending: id => pendingIds.has(id),
      toggle
    }}>
      {children}
    </Context.Provider>
  )
}

export const useWishlist = () => useContext(Context)
