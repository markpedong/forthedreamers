'use client';

import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsInput = ({ tags, onTagsChange }: TagsInputProps) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInput('');
    }
  };

  const removeTag = (tag: string) => onTagsChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          placeholder='Add a tag and press Enter'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1'
        />
        <Button onClick={addTag} variant='outline'>
          Add
        </Button>
      </div>

      {tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <div
              key={tag}
              className='flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
            >
              {tag}
              <button
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
  );
};

export default TagsInput;
