import WishListComp from '@/components/profile/wishlist'
import { TWishListItem } from '@/constants/types'
import { FC } from 'react'
type Props = {
	data: TWishListItem[]
}

const WishList: FC<Props> = ({ data }) => {
	return (
		<div>
			{data?.map(item => (
				<WishListComp key={item.id} item={item} />
			))}
		</div>
	)
}

export default WishList
