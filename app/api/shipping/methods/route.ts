import { COURIERS } from '@/constants/shipping';
import { successResponse } from '@/lib/server-helper';

/**
 * GET /api/shipping/methods
 * Get available shipping methods (Philippine couriers).
 */
export async function GET() {
  return successResponse({ methods: COURIERS });
}
