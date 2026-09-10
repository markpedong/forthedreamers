import { NextRequest } from 'next/server';
import { z } from 'zod';
import { addressIdSchema, addressSchema, addressUpdateSchema } from '@/hooks/form-schemas';
import { getCurrentUserID } from '@/lib/auth';
import * as profile from '@/lib/services/profile';
import { errorResponse, successResponse } from '@/lib/server-helper';

const requireUser = getCurrentUserID;

export const GET = async () => {
  const userId = await requireUser();
  return userId
    ? successResponse(await profile.getUserAddresses(userId))
    : errorResponse('Unauthorized', 401);
};

export const POST = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Check your address details', 400);
  return successResponse(await profile.createAddress(userId, parsed.data));
};

export const PUT = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = addressUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return errorResponse('Check your address details', 400);
  try {
    return successResponse(await profile.updateAddress(userId, parsed.data));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update address', 400);
  }
};

export const PATCH = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = z.object({ id: addressIdSchema }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('Invalid address', 400);
  try {
    return successResponse(await profile.setDefaultAddress(userId, parsed.data.id));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to update address', 400);
  }
};

export const DELETE = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return errorResponse('Unauthorized', 401);
  const parsed = addressIdSchema.safeParse(request.nextUrl.searchParams.get('id'));
  if (!parsed.success) return errorResponse('Invalid address', 400);
  try {
    return successResponse(await profile.deleteAddress(userId, parsed.data));
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to delete address', 400);
  }
};
