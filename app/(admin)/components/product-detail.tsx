'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductDetail({ product }: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toast, setToast] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Mock data for the product detail
  const mockProduct = {
    id: '1',
    name: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 328,
    description:
      'Experience premium sound quality with our flagship wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort for all-day wear.',
    images: [
      '/wireless-headphones-black.jpg',
      '/wireless-headphones-side.jpg',
      '/wireless-headphones-detail.jpg',
      '/wireless-headphones-packaging.jpg',
    ],
    variants: [
      { id: 'v1', name: 'Black', price: 299.99, stock: 15 },
      { id: 'v2', name: 'Silver', price: 299.99, stock: 8 },
      { id: 'v3', name: 'Gold', price: 329.99, stock: 5 },
    ],
    specs: [
      { label: 'Driver Size', value: '40mm' },
      { label: 'Frequency Response', value: '20Hz - 20kHz' },
      { label: 'Impedance', value: '32 Ohms' },
      { label: 'Battery Life', value: '30 hours' },
      { label: 'Charging Time', value: '2 hours' },
      { label: 'Weight', value: '250g' },
    ],
    relatedProducts: [
      {
        id: '2',
        name: 'Portable Bluetooth Speaker',
        price: 149.99,
        image: '/audio-speaker.png',
        rating: 4.3,
      },
      {
        id: '3',
        name: 'Wireless Charging Case',
        price: 79.99,
        image: '/open-briefcase.png',
        rating: 4.6,
      },
      {
        id: '4',
        name: 'Premium Audio Cable',
        price: 49.99,
        image: '/tangled-cables.png',
        rating: 4.4,
      },
      {
        id: '5',
        name: 'Headphone Stand',
        price: 39.99,
        image: '/simple-wooden-stand.png',
        rating: 4.5,
      },
    ],
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockProduct.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + mockProduct.images.length) % mockProduct.images.length,
    );
  };

  const handleEditProduct = () => {
    showNotification(`Editing product: ${mockProduct.name}`);
  };

  const handleDeleteProduct = () => {
    showNotification(`Product ${mockProduct.name} deleted`);
  };

  const handleSelectVariant = (variant: any) => {
    setSelectedVariant(variant);
    showNotification(`Selected variant: ${variant.name}`);
  };

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Image Gallery */}
          <div className='space-y-4'>
            <div className='relative bg-muted rounded-lg overflow-hidden aspect-square'>
              <img
                src={mockProduct.images[currentImageIndex] || '/placeholder.svg'}
                alt={mockProduct.name}
                className='w-full h-full object-cover'
              />
              <button
                onClick={prevImage}
                className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              <button
                onClick={nextImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>

            {/* Thumbnails */}
            <div className='flex gap-2'>
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`Thumbnail ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            <div>
              <p className='text-sm text-muted-foreground'>{mockProduct.brand}</p>
              <h1 className='text-3xl font-bold mt-2'>{mockProduct.name}</h1>

              <div className='flex items-center gap-2 mt-4'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(mockProduct.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className='text-sm text-muted-foreground'>
                  ({mockProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className='space-y-2'>
              <div className='flex items-baseline gap-2'>
                <span className='text-3xl font-bold'>${mockProduct.price}</span>
                <span className='text-lg line-through text-muted-foreground'>
                  ${mockProduct.originalPrice}
                </span>
              </div>
              <div className='text-sm text-green-600'>
                Save ${(mockProduct.originalPrice - mockProduct.price).toFixed(2)} (25% off)
              </div>
            </div>

            {/* Variants */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-base'>Available Variants</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {mockProduct.variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => handleSelectVariant(variant)}
                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                      //@ts-expect-error
                      selectedVariant?.id === variant.id ? 'border-primary bg-muted' : ''
                    }`}
                  >
                    <div>
                      <p className='font-medium text-sm'>{variant.name}</p>
                      <p className='text-xs text-muted-foreground'>${variant.price}</p>
                    </div>
                    <div className='text-right'>
                      <p
                        className={`text-xs font-medium ${variant.stock > 10 ? 'text-green-600' : variant.stock > 0 ? 'text-yellow-600' : 'text-destructive'}`}
                      >
                        {variant.stock} in stock
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button className='flex-1' onClick={handleEditProduct}>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Edit Product
              </Button>
              <Button
                variant='outline'
                className='flex-1 bg-transparent'
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue='description' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='description'>Description</TabsTrigger>
            <TabsTrigger value='specs'>Specifications</TabsTrigger>
            <TabsTrigger value='related'>Related Products</TabsTrigger>
          </TabsList>

          <TabsContent value='description' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <p className='text-sm leading-relaxed text-foreground/90'>
                  {mockProduct.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='specs' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='space-y-3'>
                  {mockProduct.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className='flex justify-between py-2 border-b last:border-0'
                    >
                      <span className='font-medium text-sm'>{spec.label}</span>
                      <span className='text-sm text-muted-foreground'>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='related' className='space-y-4'>
            <Card>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {mockProduct.relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      className='space-y-2 cursor-pointer hover:opacity-80 transition-opacity'
                    >
                      <div className='bg-muted rounded-lg overflow-hidden aspect-square'>
                        <img
                          src={relatedProduct.image || '/placeholder.svg'}
                          alt={relatedProduct.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <h4 className='text-sm font-medium line-clamp-2'>{relatedProduct.name}</h4>
                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-sm'>${relatedProduct.price}</span>
                        <div className='flex items-center gap-1'>
                          <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
                          <span className='text-xs text-muted-foreground'>
                            {relatedProduct.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </>
  );
}
