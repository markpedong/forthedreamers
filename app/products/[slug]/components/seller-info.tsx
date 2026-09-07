import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'

type SellerInfoProps = {
  seller: {
    storeName: string
    description: string | null
    logo: string | null
    createdAt: Date | string
    activeProductCount: number
  }
}

const SellerInfo = ({seller}: SellerInfoProps) => {
  const joinedDate = new Date(seller.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})

  return (
    <section className='rounded-xl border border-border bg-card p-6 sm:p-8'>
      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar className='size-16 rounded-xl border border-border'>
            <AvatarImage src={seller.logo ?? undefined} alt='' />
            <AvatarFallback className='rounded-xl text-lg'>{seller.storeName.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-xs uppercase tracking-widest text-muted-foreground'>Seller</p>
            <h2 className='mt-1 text-xl font-semibold text-foreground'>{seller.storeName}</h2>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-5 text-sm sm:min-w-64'>
          <div>
            <p className='text-muted-foreground'>Active products</p>
            <p className='mt-1 font-medium text-foreground'>{seller.activeProductCount}</p>
          </div>
          <div>
            <p className='text-muted-foreground'>Member since</p>
            <p className='mt-1 font-medium text-foreground'>{joinedDate}</p>
          </div>
        </div>
      </div>

      {seller.description && (
        <p className='mt-6 max-w-3xl border-t border-border pt-6 leading-relaxed text-muted-foreground'>{seller.description}</p>
      )}
    </section>
  )
}

export default SellerInfo
