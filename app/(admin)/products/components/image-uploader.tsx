'use client';

import { useId, useState, type ChangeEvent, type DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onUpload: (files: File[]) => Promise<string[]>;
  isUploading: boolean;
  maxImages?: number;
}

const ImageUploader = ({ images, onImagesChange, onUpload, isUploading, maxImages = 5 }: ImageUploaderProps) => {
  const uploadId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const full = images.length >= maxImages;
  const disabled = full || isUploading;

  const handleFiles = async (files: File[]) => {
    if (disabled) return;
    const allowedFiles = files.slice(0, maxImages - images.length);
    if (!allowedFiles.length) return;
    try {
      onImagesChange([...images, ...(await onUpload(allowedFiles))]);
    } catch {
      // The upload mutation displays the server error.
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    void handleFiles(files);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    void handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (index: number) => onImagesChange(images.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={onDrop}
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          id={uploadId}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          className="hidden"
          disabled={disabled}
        />
        <label htmlFor={uploadId} className="cursor-pointer select-none">
          <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            {isUploading ? 'Uploading images...' : full ? 'Maximum images reached' : 'Drop images here or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">
            {images.length}/{maxImages} images • PNG, JPG, WebP up to 10MB
          </p>
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <Image
                src={src || '/placeholder.svg'}
                alt={`Product ${i + 1}`}
                fill
                sizes="(min-width: 768px) 160px, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(i)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {i === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
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
