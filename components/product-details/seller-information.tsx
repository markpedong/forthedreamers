import React, { FC } from 'react'
import { Card, CardBody, Avatar, Button } from '@heroui/react'
import { Icon } from '@iconify/react'
import { DateFormatter } from '@internationalized/date'
import { TSellerItem } from '@/constants/types'
import { useRouter } from 'next/navigation'

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
								<span className="text-sm">{5}</span>
							</div>
							<p className="text-xs text-default-500">
								Seller since{' '}
								{new DateFormatter('en-US', {
									month: 'long',
									year: 'numeric'
								}).format(new Date(seller.createdAt))}
							</p>
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
