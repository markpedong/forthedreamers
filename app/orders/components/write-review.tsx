'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateReviewMutation } from '@/services/useMutation';

const WriteReview = ({ slug, productName }: { slug: string; productName: string }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const mutation = useCreateReviewMutation(slug, () => {
    setOpen(false);
    setRating(0);
  });
  const pending = mutation.isPending;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !rating) return;
    const data = new FormData(event.currentTarget);
    mutation.mutate({ rating, title: data.get('title'), comment: data.get('comment') });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2 text-sm">
            Rating
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value > 1 ? 's' : ''}`}
                  className="rounded p-0.5"
                >
                  <Star size={22} className={value <= rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm">
            Title (optional)
            <input name="title" maxLength={100} className="rounded-md border border-input bg-background p-2" />
          </label>

          <label className="grid gap-2 text-sm">
            Your review (optional)
            <textarea
              name="comment"
              maxLength={1000}
              rows={4}
              className="rounded-md border border-input bg-background p-2"
            />
          </label>

          <Button type="submit" disabled={pending || !rating} className="w-full">
            {pending ? 'Submitting...' : 'Submit review'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReview;
