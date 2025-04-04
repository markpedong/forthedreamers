import WishListComp from '@/components/profile/wishlist'
import { getWishlist } from '@/lib/server'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const WishList: FC = () => {
	const { data: session } = useSession()
	const { data = [] } = useQuery({
		queryKey: ['wishlist', session?.user?.id],
		queryFn: async () => {
			const response = await getWishlist(`${session?.user?.id}`)

			return response.data
		}
	})

	return (
		<div>
			{data?.map(item => (
				<WishListComp key={item.id} item={item} />
			))}
		</div>
	)
}

export default WishList
