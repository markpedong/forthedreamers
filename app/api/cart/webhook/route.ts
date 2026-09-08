import { errorResponse } from '@/lib/server-helper';

export async function POST() {
  return errorResponse('Stripe payments are currently disabled', 503);
}
