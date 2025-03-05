import { TWishListItem } from '@/constants/types'
import { Button, Card, CardBody, Image } from '@heroui/react'
import { Icon } from '@iconify/react'
import { FC } from 'react'

type Props = {
	item: TWishListItem
}

const WishListComp: FC<Props> = ({ item }) => {
	return (
		<Card key={item.id} className="w-full">
			<CardBody>
				<div className="flex items-center gap-4">
					<Image src={item.product.images?.[0]} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
					<div className="flex-grow">
						<p className="font-medium">{item.product.name}</p>
						<p className="text-medium font-semibold">${item.product.price.toFixed(2)}</p>
						<p className={`text-tiny ${!!item.product.stock ? 'text-success' : 'text-danger'}`}>
							{item.product.stock ? 'In Stock' : 'Out of Stock'}
						</p>
					</div>
					<div className="flex flex-col gap-2">
						<Button
							size="sm"
							color="primary"
							disabled={!item.product.stock}
							startContent={<Icon icon="lucide:shopping-cart" />}
						>
							Add to Cart
						</Button>
						<Button size="sm" variant="light" color="danger">
							Remove
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default WishListComp
