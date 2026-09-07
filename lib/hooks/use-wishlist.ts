import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getWishlistIds, setWishlist as apiSetWishlist } from '@/lib/http'

export const useWishlist = () => {
  const queryClient = useQueryClient()

  const { data: ids } = useQuery({
    queryKey: ['wishlist-ids'],
    queryFn: () => getWishlistIds(),
    select: (data) => data.data?.ids ?? [],
    staleTime: 1000 * 60,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, wanted }: { id: string; wanted: boolean }) =>
      apiSetWishlist(id, wanted),
    onMutate: async ({ id, wanted }) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist-ids'] })
      const previous = queryClient.getQueryData<string[]>(['wishlist-ids'])
      queryClient.setQueryData<string[]>(['wishlist-ids'], (old) => {
        if (wanted) return old ? [...old, id] : [id]
        return old ? old.filter((i) => i !== id) : []
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['wishlist-ids'], context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist-ids'] })
    },
  })

  return {
    ids: ids ?? [],
    isPending: (id: string) => toggleMutation.isPending,
    toggle: (id: string) => {
      const wanted = !(ids?.includes(id) ?? true)
      void toggleMutation.mutate({ id, wanted })
    },
  }
}
