import {Skeleton} from '@/components/ui/skeleton'

const ProductLoading = () => (
  <main className='mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-12 sm:px-6 lg:px-8'>
    <Skeleton className='h-4 w-72' />
    <section className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
      <Skeleton className='aspect-square w-full rounded-xl' />
      <div className='space-y-6'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-12 w-4/5' />
        <Skeleton className='h-12 w-40' />
        <Skeleton className='h-48 w-full' />
      </div>
    </section>
  </main>
)

export default ProductLoading
