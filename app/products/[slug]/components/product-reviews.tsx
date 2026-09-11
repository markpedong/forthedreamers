'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ProductReview, ReviewSummary } from './product-types';
import { useProductReviewsQuery } from '@/services/useQuery';

type ProductReviewsProps = {
  slug: string;
  initialReviews: ProductReview[];
  summary: ReviewSummary;
};

const ratingOptions = [5, 4, 3, 2, 1];

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(value => (
      <Star key={value} size={15} className={value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />
    ))}
  </span>
);

const ProductReviews = ({ slug, initialReviews, summary }: ProductReviewsProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const query = useProductReviewsQuery<ProductReview>(
    slug,
    page,
    selectedRating,
    pageSize,
    selectedRating === null && page === 1 ? { reviews: initialReviews, total: summary.count } : undefined
  );
  const reviews = query.data?.reviews ?? [];
  const total = query.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const selectRating = (rating: number | null) => {
    setSelectedRating(rating);
    setPage(1);
  };

  return (
    <section id="reviews" className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Customer feedback</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Ratings & reviews</h2>
      </div>

      <div className="grid gap-6 rounded-lg border border-border bg-card p-4 md:gap-8 md:p-6 lg:grid-cols-[280px_1fr] lg:p-8">
        <div className="flex flex-col items-center justify-center border-b border-border pb-6 text-center md:pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {summary.average ? summary.average.toFixed(1) : '—'}
          </p>
          <Stars rating={Math.round(summary.average)} />
          <p className="mt-2 text-sm text-muted-foreground">{summary.count} published reviews</p>
        </div>
        <div className="space-y-3">
          {ratingOptions.map(rating => {
            const count = summary.distribution[rating] ?? 0;
            const width = summary.count ? (count / summary.count) * 100 : 0;
            return (
              <div key={rating} className="grid grid-cols-[56px_1fr_36px] items-center gap-3 text-sm">
                <span className="text-muted-foreground">{rating} stars</span>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${width}%` }} />
                </div>
                <span className="text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={selectedRating === null ? 'default' : 'outline'}
          onClick={() => selectRating(null)}
          disabled={query.isFetching}
        >
          All reviews
        </Button>
        {ratingOptions.map(rating => (
          <Button
            key={rating}
            size="sm"
            variant={selectedRating === rating ? 'default' : 'outline'}
            onClick={() => selectRating(rating)}
            disabled={query.isFetching}
          >
            {rating} stars
          </Button>
        ))}
      </div>

      {query.isFetching ? (
        <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
          Loading reviews...
        </div>
      ) : query.isError ? (
        <div role="alert" className="rounded-xl border p-6">
          Unable to load reviews.{' '}
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : reviews.length ? (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {reviews.map(review => (
            <article key={review.id} className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.image ?? undefined} alt="" />
                    <AvatarFallback>{(review.user.displayName ?? review.user.username ?? 'U').slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{review.user.displayName || review.user.username}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              {review.title && <h3 className="font-medium text-foreground">{review.title}</h3>}
              {review.comment && (
                <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{review.comment}</p>
              )}
              {review.variant && <p className="text-xs text-muted-foreground">Option: {review.variant.name}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No reviews match this filter.
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Previous review page"
              disabled={page === 1 || query.isFetching}
              onClick={() => setPage(value => value - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next review page"
              disabled={page === pageCount || query.isFetching}
              onClick={() => setPage(value => value + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
