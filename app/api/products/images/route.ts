import { randomUUID } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireCatalogAccess } from '@/lib/services/admin-catalog';
import { errorResponse, successResponse } from '@/lib/server-helper';

const BUCKET = 'product-images';
const MAX_IMAGES = 5;
const MAX_SIZE = 10 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const POST = async (request: Request) => {
  try {
    const user = await requireCatalogAccess();
    const files = (await request.formData()).getAll('images').filter((value): value is File => value instanceof File);

    if (!files.length || files.length > MAX_IMAGES) return errorResponse('Upload 1 to 5 images', 400);
    if (files.some(file => !EXTENSIONS[file.type] || file.size > MAX_SIZE))
      return errorResponse('Images must be PNG, JPG, or WebP and no larger than 10MB', 400);

    const supabase = createSupabaseAdminClient();
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(BUCKET);
    if (bucketError && !bucketError.message.toLowerCase().includes('not found')) throw bucketError;
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(BUCKET, {
        public: true,
        fileSizeLimit: MAX_SIZE,
        allowedMimeTypes: Object.keys(EXTENSIONS),
      });
      if (error && !error.message.toLowerCase().includes('already exists')) throw error;
    }

    const uploaded = await Promise.all(
      files.map(async file => {
        const path = `${user.id}/${randomUUID()}.${EXTENSIONS[file.type]}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, await file.arrayBuffer(), {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      })
    );

    return successResponse(uploaded, 'Images uploaded');
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to upload images');
  }
};
