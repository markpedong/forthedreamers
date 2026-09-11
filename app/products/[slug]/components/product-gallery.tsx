'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImagePlaceholder from '@/components/reusable/image-placeholder';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGalleryProps {
  images: string[];
  previewImage?: string | null;
  alt: string;
  onSelectImage?: () => void;
  onProductImageClick?: () => void;
}

const ProductGallery = ({ images, previewImage, alt, onSelectImage, onProductImageClick }: ProductGalleryProps) => {
  const validImages = images.filter(Boolean);
  const hasMultiple = validImages.length > 1;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const currentImage = previewImage || validImages[selectedIndex];
  const hasError = currentImage ? imageErrors.has(currentImage) : false;

  const handlePrev = () => setSelectedIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
  const handleNext = () => setSelectedIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));

  const handleImageLoad = () => currentImage && setLoadedImages(prev => new Set(prev).add(currentImage));
  const handleImageError = () => {
    if (currentImage) setImageErrors(prev => new Set(prev).add(currentImage));
  };

  const renderMainImage = () => {
    if (!currentImage || hasError) return <ImagePlaceholder hasError={Boolean(currentImage)} />;

    const image = (
      <Image
        src={currentImage}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.02]"
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority
      />
    );

    return onProductImageClick ? (
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        onClick={onProductImageClick}
        aria-label="Return to selected variant image"
      >
        {image}
      </button>
    ) : (
      image
    );
  };

  const renderThumbnails = () =>
    validImages.map((img, idx) => {
      const thumbError = imageErrors.has(img);
      return (
        <button
          key={idx}
          onClick={() => {
            setSelectedIndex(idx);
            onSelectImage?.();
          }}
          className={cn(
            'relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 md:size-20',
            selectedIndex === idx
              ? 'border-primary ring-2 ring-primary/50 scale-105'
              : 'border-border hover:border-muted-foreground hover:scale-102'
          )}
          aria-label={`View image ${idx + 1}`}
          aria-pressed={selectedIndex === idx}
        >
          {thumbError ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={img}
              alt={`${alt} thumbnail ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setImageErrors(prev => new Set(prev).add(img))}
            />
          )}
        </button>
      );
    });

  return (
    <div className="flex flex-col gap-4" role="region" aria-label={`${alt} image gallery`}>
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/20">
        {currentImage && !loadedImages.has(currentImage) && !hasError && (
          <Skeleton className="absolute inset-0 z-10" />
        )}
        {renderMainImage()}

        {hasMultiple && !previewImage && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-background/90 backdrop-blur-sm transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-background/90 backdrop-blur-sm transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </Button>

            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-foreground">
              {selectedIndex + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {validImages.length > 0 && (hasMultiple || previewImage) && (
        <div className="flex gap-2 overflow-x-auto px-1 py-2">{renderThumbnails()}</div>
      )}
    </div>
  );
};

export default ProductGallery;
