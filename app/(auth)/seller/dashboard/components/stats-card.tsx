import React, { FC } from 'react'
import { Card, CardBody } from '@heroui/react'
import { Icon } from '@iconify/react'

interface StatsCardProps {
	title: string
	value: string | number
	icon: string
	trend?: {
		value: number
		isPositive: boolean
	}
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon, trend }) => {
	return (
		<Card>
			<CardBody className="flex gap-4">
				<div className="p-2 rounded-lg bg-primary/10">
					<Icon icon={icon} className="w-6 h-6 text-primary" />
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-small text-default-500">{title}</p>
					<div className="flex items-baseline gap-2">
						<span className="text-xl font-semibold">{value}</span>
						{trend && (
							<span className={`text-small ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
								{trend.isPositive ? '+' : '-'}
								{trend.value}%
							</span>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	)
}

export default StatsCard
