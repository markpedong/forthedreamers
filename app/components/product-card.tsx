'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImagePlaceholder from '@/components/reusable/image-placeholder';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getProductPrice } from '@/lib/utils';
import type { LandingProduct } from './index';

type ProductCardProps = LandingProduct & { rating?: number; reviewCount?: number; compact?: boolean };

const ProductCard: FC<ProductCardProps> = ({
  name,
  images,
  variants,
  slug,
  rating = 0,
  reviewCount = 0,
  compact = false,
}) => {
  const [isImageInvalid, setIsImageInvalid] = useState(false);
  const imageSrc = images && images.length > 0 ? images[0] : null;
  const showImage = imageSrc && !isImageInvalid;
  const price = getProductPrice(variants);
  return (
    <Link
      href={`/products/${slug}`}
      className={
        compact
          ? 'group block overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md'
          : 'group cursor-pointer space-y-3'
      }
    >
      <AspectRatio
        ratio={compact ? 1 : 3 / 4}
        className={compact ? 'overflow-hidden bg-muted' : 'overflow-hidden rounded-sm'}
      >
        {showImage ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes={
              compact
                ? '(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw'
                : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
            }
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setIsImageInvalid(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </AspectRatio>
      <div className={compact ? 'space-y-1.5 p-3' : undefined}>
        <h3 className={compact ? 'line-clamp-2 min-h-10 text-sm font-medium leading-5' : 'font-medium'}>{name}</h3>
        {reviewCount > 0 && (
          <p className={compact ? 'text-xs text-muted-foreground' : 'mt-1 text-xs text-muted-foreground'}>
            ★ {rating.toFixed(1)} · {reviewCount} reviews
          </p>
        )}
        <p className={compact ? 'text-base font-semibold text-foreground' : 'text-sm text-muted-foreground'}>
          {price != null ? `$ ${price.toFixed(2)}` : 'Price unavailable'}
        </p>
      </div>
    </Link>
  );
};
export default ProductCard;
