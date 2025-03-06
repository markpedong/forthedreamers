import Image from 'next/image'
import React, { FC, useState } from 'react'

const ProductImages: FC<{ images: string[] }> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0] || '')

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-default-100">
        <Image src={activeImage} alt="Product image" className="h-full w-full object-cover" width={500} height={500} />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square h-16 w-16 overflow-hidden rounded-md border-2 ${
              activeImage === image ? 'border-primary' : 'border-transparent'
            }`}
            onClick={() => setActiveImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
