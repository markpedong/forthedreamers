import React, { FC } from 'react'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'

interface Props {
	quantity: number
	onQuantityChange: (quantity: number) => void
	maxQuantity?: number
}

const QuantitySelector: FC<Props> = ({ quantity, onQuantityChange, maxQuantity = 99 }) => {
	const increment = () => {
		if (quantity < maxQuantity) {
			onQuantityChange(quantity + 1)
		}
	}

	const decrement = () => {
		if (quantity > 1) {
			onQuantityChange(quantity - 1)
		}
	}

	return (
		<div className="flex items-center">
			<Button
				isIconOnly
				size="sm"
				variant="flat"
				onPress={decrement}
				isDisabled={quantity <= 1}
				aria-label="Decrease quantity"
			>
				<Icon icon="lucide:minus" />
			</Button>

			<span className="w-12 text-center font-medium">{quantity}</span>

			<Button
				isIconOnly
				size="sm"
				variant="flat"
				onPress={increment}
				isDisabled={quantity >= maxQuantity}
				aria-label="Increase quantity"
			>
				<Icon icon="lucide:plus" />
			</Button>
		</div>
	)
}

export default QuantitySelector
