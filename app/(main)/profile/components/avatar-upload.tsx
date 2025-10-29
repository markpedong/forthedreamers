'use client';

import { useState, useRef, FC, useTransition } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserImage } from '@/lib/server-actions';
import { toBase64 } from '@/lib/utils';

interface AvatarUploadProps {
  src?: string;
  alt: string;
  initials: string;
}

const AvatarUpload: FC<AvatarUploadProps> = ({ src, alt, initials }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setPreview(base64 as string);

    startTransition(async () => {
      try {
        await updateUserImage({ image: base64 as string });
        toast.success('Profile image updated');
      } catch (err) {
        toast.error('Failed to update image');
        console.error(err);
      }
    });
  };

  return (
    <div
      className='relative h-16 w-16 cursor-pointer'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <Avatar className='h-16 w-16'>
        <AvatarImage src={preview} alt={alt} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div
        className={`absolute inset-0 flex items-center justify-center rounded-full border-2 border-dashed border-primary bg-black/40 transition-all duration-200 ${
          isHovering && !isPending
            ? 'opacity-100 scale-105'
            : 'opacity-0 scale-100 pointer-events-none'
        }`}
      >
        <div className='flex flex-col items-center gap-1'>
          <Plus className='h-5 w-5 text-white' />
          <span className='text-xs font-medium text-white text-center px-1'>
            {preview ? 'Change Photo' : 'Upload Photo'}
          </span>
        </div>
      </div>

      {isPending && (
        <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40'>
          <Loader2 className='h-5 w-5 animate-spin text-white' />
        </div>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
        aria-label='Upload profile photo'
        disabled={isPending}
      />
    </div>
  );
};

export default AvatarUpload;
