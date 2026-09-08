import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addressIdSchema, addressSchema, addressUpdateSchema } from '@/hooks/form-schemas';
import { getSession } from '@/lib/services/auth';
import * as profile from '@/lib/services/profile';

const requireUser = async () => (await getSession())?.user.id;

export const GET = async () => {
  const userId = await requireUser();
  return userId
    ? NextResponse.json({ success: true, data: await profile.getUserAddresses(userId) })
    : NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
};

export const POST = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = addressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ success: false, message: 'Check your address details' }, { status: 400 });
  return NextResponse.json({ success: true, data: await profile.createAddress(userId, parsed.data) });
};

export const PUT = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = addressUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ success: false, message: 'Check your address details' }, { status: 400 });
  try {
    return NextResponse.json({ success: true, data: await profile.updateAddress(userId, parsed.data) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to update address' },
      { status: 400 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = z.object({ id: addressIdSchema }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid address' }, { status: 400 });
  try {
    return NextResponse.json({ success: true, data: await profile.setDefaultAddress(userId, parsed.data.id) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to update address' },
      { status: 400 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const parsed = addressIdSchema.safeParse(request.nextUrl.searchParams.get('id'));
  if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid address' }, { status: 400 });
  try {
    return NextResponse.json({ success: true, data: await profile.deleteAddress(userId, parsed.data) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to delete address' },
      { status: 400 }
    );
  }
};
