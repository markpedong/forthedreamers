import { NextRequest } from 'next/server';
import { z } from 'zod';
import { errorResponse, successResponse } from '@/lib/server-helper';
import { courierSelectionSchema, updateSellerShippingSettings } from '@/lib/services/seller';

const updateSchema = z.object({ courierCodes: courierSelectionSchema });

export async function PUT(request: NextRequest) {
  const input = updateSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return errorResponse('Select at least one valid courier without duplicates', 400);

  try {
    return successResponse(await updateSellerShippingSettings(input.data.courierCodes), 'Shipping settings saved');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save shipping settings';
    return errorResponse(message, message === 'Unauthorized' ? 401 : 400);
  }
}
