import Image from 'next/image'
import React, { FC } from 'react'

type Props = {}

const Product: FC<Props> = () => {
	return (
		<div className="flex flex-col gap-1 items-center  keen-slider__slide font-[Sora]">
			<Image src="/images/shirt1.png" alt="" width={200} height={200} className="h-auto w-[14rem]" />
			<div className="grid grid-cols-6 grid-rows-2 justify-items-start items-center gap-x-2 gap-y-0">
				<div className="text-md truncate w-[10rem]" style={{ gridArea: '1/1/2/5' }}>
					Shirt Green Women
				</div>
				<div className="text-xs" style={{ gridArea: '2/1/3/5' }}>
					$50.00
				</div>
				<div
					className="text-[0.6rem] bg-gray-500 text-neutral-300 justify-self-end p-[0.1rem] rounded-sm"
					style={{ gridArea: '1/5/2/7' }}
				>
					50%
				</div>
				<div className="text-xs justify-self-end text-neutral-400" style={{ gridArea: '2/5/3/7' }}>
					$100.00
				</div>
				<span className="self-start text-xs" style={{ gridArea: '3/1/4/7' }}>
					2 Styles Available
				</span>
			</div>
		</div>
	)
}

export default Product
