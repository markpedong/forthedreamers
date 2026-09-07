'use client'

import {useAppSelector} from '@/redux/store'
import {type FormEvent, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {Button} from '@/components/ui/button'

const ReviewForm = ({slug}: {slug: string}) => {
  const user = useAppSelector(state => state.userData.data)
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({rating: Number(data.get('rating')), title: data.get('title'), comment: data.get('comment')})
      })
      const result = (await response.json()) as {success?: boolean; message?: string}
      if (!response.ok || !result.success) throw new Error(result.message ?? 'Unable to submit review')
      setSubmitted(true)
      toast.success('Review submitted')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit review')
    } finally {
      setPending(false)
    }
  }

  if (!user)
    return (
      <p className='text-sm text-muted-foreground'>
        <Link className='underline' href='/sign-in'>
          Sign in
        </Link>{' '}
        to review a purchased product.
      </p>
    )
  if (submitted)
    return (
      <p role='status' className='text-sm'>
        Thank you for sharing your review.
      </p>
    )

  return (
    <form onSubmit={submit} className='space-y-4 rounded-xl border border-border p-6'>
      <h3 className='font-medium'>Write a review</h3>
      <p className='text-sm text-muted-foreground'>One review per product. A paid purchase is required and checked when you submit.</p>
      <fieldset disabled={pending} className='grid gap-4'>
        <label className='grid gap-2 text-sm'>
          Rating
          <select name='rating' required defaultValue='' className='rounded-md border bg-background p-2'>
            <option value='' disabled>
              Select a rating
            </option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </label>
        <label className='grid gap-2 text-sm'>
          Title (optional)
          <input name='title' maxLength={100} className='rounded-md border bg-background p-2' />
        </label>
        <label className='grid gap-2 text-sm'>
          Your review (optional)
          <textarea name='comment' maxLength={1000} rows={4} className='rounded-md border bg-background p-2' />
        </label>
        <Button type='submit' className='justify-self-start'>
          {pending ? 'Submitting review...' : 'Submit review'}
        </Button>
      </fieldset>
    </form>
  )
}

export default ReviewForm
