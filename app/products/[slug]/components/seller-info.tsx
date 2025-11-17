import { TSeller } from '@/lib/types'
import { Mail, MapPin, Phone, Star } from 'lucide-react'
import { FC } from 'react'

const SellerInfo: FC<{seller: TSeller}> = ({seller}) => {
  return (
    <div className='space-y-8'>
      <div className='flex gap-4 pb-8 border-b border-border'>
        {seller.logo && (
          <img
            src={seller.logo || '/placeholder.svg'}
            alt={seller.storeName}
            className='w-20 h-20 rounded-lg object-cover border border-border'
          />
        )}
        <div className='flex-1'>
          <h3 className='text-2xl font-semibold text-foreground mb-2'>{seller.storeName}</h3>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(seller.rating) ? 'fill-accent text-accent' : 'text-muted-foreground'} />
                ))}
              </div>
              <span className='text-sm font-semibold text-foreground'>{seller.rating}</span>
            </div>
            <span className='text-sm text-muted-foreground'>({seller.reviewCount} reviews)</span>
            <span className='text-sm text-muted-foreground'>•</span>
            <span className='text-sm text-muted-foreground'>{seller.totalSales.toLocaleString()} sales</span>
          </div>
        </div>
      </div>

      {seller.description && (
        <div>
          <h4 className='font-semibold text-foreground mb-3'>About Seller</h4>
          <p className='text-muted-foreground leading-relaxed'>{seller.description}</p>
        </div>
      )}

      <div>
        <h4 className='font-semibold text-foreground mb-4'>Contact Information</h4>
        <div className='space-y-3'>
          {seller.address && (
            <div className='flex gap-3 items-start'>
              <MapPin size={18} className='text-muted-foreground flex-shrink-0 mt-0.5' />
              <span className='text-muted-foreground'>{seller.address}</span>
            </div>
          )}
          {seller.contact && (
            <div className='flex gap-3 items-center'>
              <Phone size={18} className='text-muted-foreground' />
              <span className='text-muted-foreground'>{seller.contact}</span>
            </div>
          )}
          <div className='flex gap-3 items-center'>
            <Mail size={18} className='text-muted-foreground' />
            <span className='text-muted-foreground'>support@{seller.storeName.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-3 pt-4 border-t border-border'>
        <div className='text-center'>
          <p className='text-sm font-semibold text-foreground mb-1'>Fast Shipping</p>
          <p className='text-xs text-muted-foreground'>Average 3-5 days</p>
        </div>
        <div className='text-center'>
          <p className='text-sm font-semibold text-foreground mb-1'>Genuine Products</p>
          <p className='text-xs text-muted-foreground'>100% authentic guaranteed</p>
        </div>
        <div className='text-center'>
          <p className='text-sm font-semibold text-foreground mb-1'>Easy Returns</p>
          <p className='text-xs text-muted-foreground'>30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  )
}

export default SellerInfo
