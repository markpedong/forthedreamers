import WishListComp from '@/components/profile/wishlist'
import { TWishListItem } from '@/constants/types'
import { getWishlist } from '@/lib/server'
import { Wishlists } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { FC } from 'react'

const WishList: FC<{ data: TWishListItem[] }> = ({ data }) => {
	return (
		<div>
			{data?.map(item => (
				<WishListComp key={item.id} item={item} />
			))}
		</div>
	)
}

export default WishList
