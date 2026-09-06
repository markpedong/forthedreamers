'use client'

import {useState} from 'react'
import {ChevronLeft, ChevronRight, Star} from 'lucide-react'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import type {ProductReview, ReviewSummary} from './product-types'

type ProductReviewsProps = {
  slug: string
  initialReviews: ProductReview[]
  summary: ReviewSummary
}

const ratingOptions = [5, 4, 3, 2, 1]

const Stars = ({rating}: {rating: number}) => (
  <span className='flex items-center gap-0.5' aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(value => (
      <Star key={value} size={15} className={value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />
    ))}
  </span>
)

const ProductReviews = ({slug, initialReviews, summary}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState(initialReviews)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(summary.count)
  const [loading, setLoading] = useState(false)
  const pageSize = 6
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  const loadReviews = async (rating: number | null, nextPage: number) => {
    setLoading(true)
    const params = new URLSearchParams({page: String(nextPage), limit: String(pageSize)})
    if (rating) params.set('rating', String(rating))

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(slug)}/reviews?${params.toString()}`, {cache: 'no-store'})
      const result = (await response.json()) as {success?: boolean; reviews?: ProductReview[]; total?: number; message?: string}
      if (!response.ok || !result.success || !result.reviews) throw new Error(result.message ?? 'Unable to load reviews')
      setReviews(result.reviews)
      setTotal(result.total ?? 0)
      setPage(nextPage)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const selectRating = (rating: number | null) => {
    setSelectedRating(rating)
    if (rating === null) {
      setReviews(initialReviews)
      setTotal(summary.count)
      setPage(1)
      return
    }
    void loadReviews(rating, 1)
  }

  return (
    <section id='reviews' className='space-y-8'>
      <div>
        <p className='text-xs uppercase tracking-widest text-muted-foreground'>Customer feedback</p>
        <h2 className='mt-2 text-2xl font-semibold tracking-tight text-foreground'>Ratings & reviews</h2>
      </div>

      <div className='grid gap-8 rounded-xl border border-border bg-card p-6 lg:grid-cols-[280px_1fr] lg:p-8'>
        <div className='flex flex-col items-center justify-center border-b border-border pb-8 text-center lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8'>
          <p className='text-5xl font-semibold tracking-tight text-foreground'>{summary.average ? summary.average.toFixed(1) : '—'}</p>
          <Stars rating={Math.round(summary.average)} />
          <p className='mt-2 text-sm text-muted-foreground'>{summary.count} published reviews</p>
        </div>
        <div className='space-y-3'>
          {ratingOptions.map(rating => {
            const count = summary.distribution[rating] ?? 0
            const width = summary.count ? (count / summary.count) * 100 : 0
            return (
              <div key={rating} className='grid grid-cols-[56px_1fr_36px] items-center gap-3 text-sm'>
                <span className='text-muted-foreground'>{rating} stars</span>
                <div className='h-2 overflow-hidden rounded-full bg-muted'>
                  <div className='h-full rounded-full bg-primary transition-all' style={{width: `${width}%`}} />
                </div>
                <span className='text-right text-muted-foreground'>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button size='sm' variant={selectedRating === null ? 'default' : 'outline'} onClick={() => selectRating(null)} disabled={loading}>
          All reviews
        </Button>
        {ratingOptions.map(rating => (
          <Button
            key={rating}
            size='sm'
            variant={selectedRating === rating ? 'default' : 'outline'}
            onClick={() => selectRating(rating)}
            disabled={loading}
          >
            {rating} stars
          </Button>
        ))}
      </div>

      {loading ? (
        <div className='rounded-xl border border-border p-8 text-center text-sm text-muted-foreground'>Loading reviews...</div>
      ) : reviews.length ? (
        <div className='divide-y divide-border rounded-xl border border-border bg-card'>
          {reviews.map(review => (
            <article key={review.id} className='space-y-4 p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={review.user.image ?? undefined} alt='' />
                    <AvatarFallback>{review.user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium text-foreground'>{review.user.name}</p>
                    <p className='text-xs text-muted-foreground'>{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.title && <h3 className='font-medium text-foreground'>{review.title}</h3>}
              {review.comment && <p className='whitespace-pre-line leading-relaxed text-muted-foreground'>{review.comment}</p>}
              {review.variant && <p className='text-xs text-muted-foreground'>Purchased: {review.variant.name}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className='rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
          No reviews match this filter.
        </div>
      )}

      {pageCount > 1 && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>Page {page} of {pageCount}</p>
          <div className='flex gap-2'>
            <Button
              size='icon'
              variant='outline'
              aria-label='Previous review page'
              disabled={page === 1 || loading}
              onClick={() => void loadReviews(selectedRating, page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              size='icon'
              variant='outline'
              aria-label='Next review page'
              disabled={page === pageCount || loading}
              onClick={() => void loadReviews(selectedRating, page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductReviews
