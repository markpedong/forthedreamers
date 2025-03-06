import { TProductItem } from '@/constants/types'
import { calculateDiscountPercentage } from '@/utils/helpers'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

type Props = {
  product: TProductItem
}

const Product: FC<Props> = ({ product }) => {
  const firstVariation = product?.variations?.find(v => !!v.discountedPrice)
  const discountPercentage = calculateDiscountPercentage(
    firstVariation?.price || 0,
    firstVariation?.discountedPrice || 0
  )
  const { push } = useRouter()

  return (
    <div className="flex flex-col gap-1 items-center  keen-slider__slide font-[Sora]">
      <Image
        src={product?.images?.[0] || ''}
        alt=""
        width={200}
        height={200}
        className="h-auto w-[14rem]"
        onClick={() => push(`/products/${product?.id}`)}
      />
      <div className="grid grid-cols-6 grid-rows-2 justify-items-start items-center gap-x-2 gap-y-0">
        <div
          className="text-md truncate w-[10rem]"
          style={{ gridArea: '1/1/2/5' }}
          onClick={() => push(`/products/${product?.id}`)}
        >
          {product?.name}
        </div>
        <div className="text-xs" style={{ gridArea: '2/1/3/5' }}>
          ${firstVariation?.discountedPrice}
        </div>
        <div
          className="text-[0.6rem] bg-gray-500 text-neutral-300 justify-self-end p-[0.1rem] rounded-sm"
          style={{ gridArea: '1/5/2/7' }}
        >
          {discountPercentage}%
        </div>
        <div className="text-xs justify-self-end text-neutral-400" style={{ gridArea: '2/5/3/7' }}>
          ${firstVariation?.price}
        </div>
        <span className="self-start text-xs" style={{ gridArea: '3/1/4/7' }}>
          {product?.variations?.length} Styles Available
        </span>
      </div>
    </div>
  )
}

export default Product
