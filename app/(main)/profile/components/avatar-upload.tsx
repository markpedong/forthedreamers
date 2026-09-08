'use client';

import { useState, useRef, FC } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Loader2 } from 'lucide-react';
import { toBase64 } from '@/lib/utils';
import { useUpdateProfileMutation } from '@/services/useMutation';

interface AvatarUploadProps {
  src?: string;
  alt: string;
  initials: string;
  isGoogleAvatar?: boolean;
}

const AvatarUpload: FC<AvatarUploadProps> = ({ src, alt, initials, isGoogleAvatar = false }) => {
  const [preview, setPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateProfileMutation({
    successMessage: 'Profile image updated',
    onError: () => setPreview(undefined),
  });
  const isPending = mutation.isPending;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setPreview(base64 as string);

    mutation.mutate({ image: base64 as string });
  };

  return (
    <div
      className="group relative h-20 w-20 shrink-0 cursor-pointer sm:h-24 sm:w-24"
      onClick={() => fileInputRef.current?.click()}
    >
      <Avatar className="h-20 w-20 border border-border sm:h-24 sm:w-24">
        <AvatarImage src={preview ?? src} alt={alt} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {!isGoogleAvatar && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="flex flex-col items-center gap-1">
            <Plus className="h-5 w-5 text-white" />
            <span className="px-1 text-center text-xs font-medium text-white">
              {preview || src ? 'Change Photo' : 'Upload Photo'}
            </span>
          </div>
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile photo"
        disabled={isPending}
      />
    </div>
  );
};

export default AvatarUpload;
