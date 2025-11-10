'use client';

import { useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader = ({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const full = images.length >= maxImages;

  const handleFiles = (files: File[]) => {
    if (full) return;
    const allowedFiles = files.slice(0, maxImages - images.length);
    const newImages = allowedFiles.map((file) => URL.createObjectURL(file));
    onImagesChange([...images, ...newImages]);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFiles(Array.from(e.target.files || []));
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (index: number) => onImagesChange(images.filter((_, i) => i !== index));

  return (
    <div className='space-y-4'>
      {/* Upload Area */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          full && 'opacity-50 pointer-events-none',
        )}
      >
        <input
          id='image-upload'
          type='file'
          multiple
          accept='image/*'
          onChange={onFileChange}
          className='hidden'
          disabled={full}
        />
        <label htmlFor='image-upload' className='cursor-pointer select-none'>
          <Upload className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <p className='text-sm font-medium mb-1'>
            {full ? 'Maximum images reached' : 'Drop images here or click to upload'}
          </p>
          <p className='text-xs text-muted-foreground'>
            {images.length}/{maxImages} images • PNG, JPG up to 10MB
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
          {images.map((src, i) => (
            <div
              key={i}
              className='relative group aspect-square rounded-lg overflow-hidden border border-border'
            >
              <img
                src={src || '/placeholder.svg'}
                alt={`Product ${i + 1}`}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => removeImage(i)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
              {i === 0 && (
                <div className='absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded'>
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
