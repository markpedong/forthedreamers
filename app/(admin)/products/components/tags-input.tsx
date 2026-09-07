'use client'

import { useState, type KeyboardEvent, FC } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagsInputProps } from '@/lib/types'

const TagsInput: FC<TagsInputProps> = ({tags, onTagsChange}) => {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (!tag) return

    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag])
    }
    setInput('')
  }

  const removeTag = (tag: string) => onTagsChange(tags.filter(value => value !== tag))

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          placeholder='Add a tag and press Enter'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1'
        />
        <Button onClick={addTag} variant='outline'>
          Add
        </Button>
      </div>

      {tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {tags.map(tag => (
            <div key={tag} className='flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'>
              {tag}
              <button
                type='button'
                onClick={() => removeTag(tag)}
                className='hover:text-destructive transition-colors'
                aria-label={`Remove tag ${tag}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagsInput
