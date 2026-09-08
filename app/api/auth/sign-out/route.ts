import { NextResponse } from 'next/server';
import { signOut } from '@/lib/services/auth';

export const POST = async () => {
  const { error } = await signOut();
  return error
    ? NextResponse.json({ success: false, message: error.message }, { status: 400 })
    : NextResponse.json({ success: true });
};
