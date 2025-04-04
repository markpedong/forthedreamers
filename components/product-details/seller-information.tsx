import { TSellerItem } from '@/constants/types'
import { calculateSellerRating, dateFormatter } from '@/utils/helpers'
import { Avatar, Button, Card, CardBody } from '@heroui/react'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

type Props = {
	seller: TSellerItem
}

const SellerInformation: FC<Props> = ({ seller }) => {
	const router = useRouter()

	return (
		<Card className="font-[Sora]">
			<CardBody>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<Avatar src={`${seller?.image}`} size="lg" />
						<div className="flex flex-col">
							<h3 className="text-lg font-semibold">{seller?.storeName}</h3>
							<div className="flex items-center gap-1">
								<Icon icon="lucide:star" className="text-warning" />
								<span className="text-sm">{calculateSellerRating(seller.products)}</span>
							</div>
							<p className="text-xs text-default-500">Seller since {dateFormatter(seller.createdAt, 'monthYear')}</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm font-medium">
							{seller._count.products} product{seller._count.products > 1 && 's'}
						</div>
						<Button
							size="sm"
							variant="bordered"
							color="primary"
							className=" cursor-pointer"
							onPress={() => router.push(`/seller/${seller.id}`)}
						>
							View Store
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default SellerInformation
