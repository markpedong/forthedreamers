'use client';

import { useState } from 'react';
import { Edit2, Eye, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductGrid({ products, selectedProduct, onSelectProduct }: any) {
  const [toast, setToast] = useState('');

  const handleEdit = (product: any) => {
    showNotification(`Editing product: ${product.name}`);
  };

  const showNotification = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {products.map((product: any) => (
          <Card key={product.id} className='hover:shadow-lg transition-shadow'>
            <CardContent className='p-0'>
              {/* Image */}
              <div className='relative w-full h-40 bg-muted overflow-hidden rounded-t-lg'>
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className='w-full h-full object-cover hover:scale-105 transition-transform'
                />
                {product.originalPrice > product.price && (
                  <div className='absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded text-xs font-bold'>
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100,
                    )}
                    %
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='p-4 space-y-3'>
                <div>
                  <p className='text-xs text-muted-foreground'>{product.brand}</p>
                  <h3 className='font-semibold text-sm line-clamp-2'>{product.name}</h3>
                </div>

                {/* Rating */}
                <div className='flex items-center gap-1'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className='text-xs text-muted-foreground'>({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className='flex items-baseline gap-2'>
                  <span className='font-bold text-lg'>${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className='text-sm line-through text-muted-foreground'>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className='text-xs'>
                  <span
                    className={
                      product.stock > 10
                        ? 'text-green-600'
                        : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-destructive'
                    }
                  >
                    {product.stock} in stock
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 pt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 bg-transparent'
                    onClick={() => onSelectProduct(product)}
                  >
                    <Eye className='w-3 h-3 mr-1' />
                    View
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 bg-transparent'
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className='w-3 h-3 mr-1' />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
